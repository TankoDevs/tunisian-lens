import { Camera, Aperture, Eye } from "lucide-react";
import { motion } from "framer-motion";

export function About() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="border-b border-border">
                <div className="container mx-auto px-6 py-24 text-center max-w-3xl space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex justify-center mb-6">
                            <Camera className="h-8 w-8 text-sand-400" strokeWidth={1.2} />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500 mb-4">Our Story</p>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight leading-tight">About Tunisian Lens</h1>
                        <p className="text-lg text-muted-foreground mt-4">Connecting the visual storytellers of Tunisia with the world.</p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-2xl space-y-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                        <p>
                            Tunisia is a country of vibrant colors, rich history, and diverse landscapes. From the azure waters of the Mediterranean to the golden sands of the Sahara, every corner of our nation tells a story.
                        </p>
                        <p>
                            <strong className="text-foreground">Tunisian Lens</strong> was created with a simple mission: to provide a dedicated stage for the incredible visual talent that exists within our borders. We believe that Tunisian creatives — photographers and videographers alike — deserve a world-class platform to showcase their portfolios, free from the noise of general social media.
                        </p>
                        <p>
                            Whether you are a seasoned professional looking for new clients or an emerging artist sharing your unique perspective, this platform is for you. We aim to foster a community where creativity thrives and where the beauty of Tunisia is celebrated daily.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-muted/30 border-y border-border">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-3xl mx-auto">
                        {[
                            { icon: Camera, num: "500+", label: "Active Artists" },
                            { icon: Aperture, num: "2.5k", label: "Projects Uploaded" },
                            { icon: Eye, num: "100%", label: "Tunisian Made" },
                        ].map(({ icon: Icon, num, label }) => (
                            <motion.div
                                key={label}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                                className="text-center space-y-3"
                            >
                                <Icon className="h-5 w-5 text-sand-400 mx-auto" strokeWidth={1.5} />
                                <h3 className="text-4xl font-serif font-bold">{num}</h3>
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
