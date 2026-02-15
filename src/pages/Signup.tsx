import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";
import { Camera } from "lucide-react";

export function Signup() {
    return (
        <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2">
            {/* Image Section (Left on Desktop) */}
            <div className="hidden md:block relative bg-muted order-2 md:order-1">
                <img
                    src="https://images.unsplash.com/photo-1563215286-34e065f49e47?q=80&w=1200&auto=format&fit=crop"
                    alt="Tunisian Door"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-8 left-8 right-8 text-white p-6 bg-black/40 backdrop-blur-sm rounded-lg">
                    <p className="text-lg font-serif font-medium">Join the community of top Tunisian creators.</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="flex items-center justify-center p-8 bg-background order-1 md:order-2">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="text-center md:text-left space-y-2">
                        <Link to="/" className="inline-flex items-center space-x-2 md:hidden mb-4">
                            <Camera className="h-6 w-6" />
                            <span className="font-serif text-xl font-bold">Tunisian Lens</span>
                        </Link>
                        <h1 className="text-3xl font-serif font-bold tracking-tight">Create an account</h1>
                        <p className="text-muted-foreground">Showcase your work to the world</p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="first-name" className="text-sm font-medium leading-none">First name</label>
                                <Input id="first-name" placeholder="First Name" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="last-name" className="text-sm font-medium leading-none">Last name</label>
                                <Input id="last-name" placeholder="Last Name" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                            <Input id="email" type="email" placeholder="name@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
                            <Input id="password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="city" className="text-sm font-medium leading-none">City</label>
                            <Input id="city" placeholder="Tunis" />
                        </div>
                        <Button className="w-full" type="submit">Create Account</Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
