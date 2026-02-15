import { Camera } from "lucide-react";

export function About() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl space-y-12 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-muted rounded-full">
                        <Camera className="h-10 w-10 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">About Tunisian Lens</h1>
                <p className="text-xl text-muted-foreground">Connecting the visual storytellers of Tunisia with the world.</p>
            </div>

            <div className="prose prose-lg mx-auto text-muted-foreground">
                <p>
                    Tunisia is a country of vibrant colors, rich history, and diverse landscapes. From the azure waters of the Mediterranean to the golden sands of the Sahara, every corner of our nation tells a story.
                </p>
                <p>
                    <strong>Tunisian Lens</strong> was created with a simple mission: to provide a dedicated stage for the incredible photographic talent that exists within our borders. We believe that Tunisian photographers deserve a world-class platform to showcase their portfolios, free from the noise of general social media.
                </p>
                <p>
                    Whether you are a seasoned professional looking for new clients or an emerging artist sharing your unique perspective, this platform is for you. We aim to foster a community where creativity thrives and where the beauty of Tunisia is celebrated daily.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t">
                <div className="text-center space-y-2">
                    <h3 className="text-3xl font-bold text-foreground">500+</h3>
                    <p className="text-sm font-medium">Active Artists</p>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-3xl font-bold text-foreground">2.5k</h3>
                    <p className="text-sm font-medium">Projects Uploaded</p>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-3xl font-bold text-foreground">100%</h3>
                    <p className="text-sm font-medium">Tunisian Made</p>
                </div>
            </div>
        </div>
    );
}
