// functions/api/validate-password.ts
// Cloudflare Pages edge function to validate password complexity and reject weak keys.

interface RequestBody {
  password?: string;
  email?: string;
  name?: string;
}

const COMMON_PASSWORDS = new Set([
  'password', 'password123', 'admin', 'admin123', 'qwerty', 'qwerty123',
  '123456', '12345678', '123456789', '1234567890', '111111', '000000',
  'welcome', 'welcome123', 'tunisia', 'tunisie', 'tunis123', 'carthage',
  'sidibousaid', 'photography', 'photographer', 'lens123', 'camera123',
  'master', 'secret', 'pass123', 'iloveyou', 'sunshine', 'football',
  'login123', 'secure123', 'creative', 'client123', 'testing123'
]);

export async function onRequestPost({ request }: { request: Request }) {
  try {
    const { password = '', email = '', name = '' } = (await request.json()) as RequestBody;

    const requirements = {
      minLength: password.length >= 10,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`§±]/.test(password),
      noCommonPattern: true,
      noPersonalInfo: true,
    };

    const errors: string[] = [];
    const lowerPwd = password.toLowerCase().trim();

    if (!requirements.minLength) errors.push('Minimum 10 characters required.');
    if (!requirements.hasUppercase) errors.push('At least one uppercase letter (A-Z) required.');
    if (!requirements.hasLowercase) errors.push('At least one lowercase letter (a-z) required.');
    if (!requirements.hasNumber) errors.push('At least one number (0-9) required.');
    if (!requirements.hasSpecialChar) errors.push('At least one special character (!@#$%...) required.');

    if (COMMON_PASSWORDS.has(lowerPwd) || /(.)\1{3,}/.test(password) || /12345|abcdef|qwerty/.test(lowerPwd)) {
      requirements.noCommonPattern = false;
      errors.push('Password contains common or easily guessable patterns.');
    }

    if (email) {
      const emailPrefix = email.split('@')[0].toLowerCase();
      if (emailPrefix.length >= 3 && lowerPwd.includes(emailPrefix)) {
        requirements.noPersonalInfo = false;
        errors.push('Password cannot contain email username.');
      }
    }

    if (name) {
      const nameParts = name.toLowerCase().split(/\s+/).filter(part => part.length >= 3);
      for (const part of nameParts) {
        if (lowerPwd.includes(part)) {
          requirements.noPersonalInfo = false;
          errors.push('Password cannot contain your name.');
          break;
        }
      }
    }

    const isValid = errors.length === 0;

    let score = 0;
    if (password.length >= 10) score += 1;
    if (password.length >= 14) score += 1;
    if (requirements.hasUppercase && requirements.hasLowercase) score += 1;
    if (requirements.hasNumber && requirements.hasSpecialChar) score += 1;
    if (!requirements.noCommonPattern || !requirements.noPersonalInfo) score = Math.max(0, score - 2);

    return new Response(
      JSON.stringify({
        isValid,
        score,
        requirements,
        errors,
        policy: 'NIST SP 800-63B Hardened Archival Standard',
      }),
      {
        status: isValid ? 200 : 422,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Password evaluation failed';
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 400,
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
