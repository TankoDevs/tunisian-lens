// functions/api/detect.ts
interface CloudflareEnv {
  AI?: {
    run: (model: string, options: Record<string, unknown>) => Promise<{ response?: string }>;
  };
}

export async function onRequestPost({ request, env }: { request: Request; env: CloudflareEnv }) {
  try {
    const { imageUrl } = (await request.json()) as { imageUrl?: string };

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'No image provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let isSafe = true;
    let suggestedTags = ['tunisia', 'heritage', 'photography'];

    // Running automated label & safety inspection with Cloudflare Workers AI if bound
    if (env && env.AI && typeof env.AI.run === 'function') {
      try {
        const imageRes = await fetch(imageUrl);
        const imageBytes = [...new Uint8Array(await imageRes.arrayBuffer())];

        const aiResponse = await env.AI.run('@cf/meta/llama-3.2-11b-vision-instruct', {
          prompt: 'Examine this image for a cultural photography site. Return JSON with: isSafe (boolean), isTunisianTheme (boolean), and tags (array of 5 strings).',
          image: imageBytes,
        });

        const parsed = JSON.parse(aiResponse?.response || '{}');
        if (typeof parsed.isSafe === 'boolean') isSafe = parsed.isSafe;
        if (Array.isArray(parsed.tags) && parsed.tags.length > 0) suggestedTags = parsed.tags;
      } catch (aiErr) {
        console.warn('Cloudflare Workers AI execution failed or unavailable:', aiErr);
      }
    }

    return new Response(
      JSON.stringify({
        isSafe,
        suggestedTags,
        status: isSafe ? 'published' : 'flagged',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Detection failed';
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
