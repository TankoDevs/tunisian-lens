import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { GlobalAlert } from "../components/ui/GlobalAlert";

export function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
            <GlobalAlert />
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
