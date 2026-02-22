import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { Explore } from "./pages/Explore";
import { ArtistProfile } from "./pages/ArtistProfile";
import { ProjectDetails } from "./pages/ProjectDetails";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { About } from "./pages/About";
import { SubmitProject } from "./pages/SubmitProject";

import { ClientAccess } from "./pages/ClientAccess";
import { Links } from "./pages/Links";
import { LoadingScreen } from "./components/ui/LoadingScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load time or wait for resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2s total to allow at least one full rotation + extra for "clean" feel

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/submit" element={<SubmitProject />} />
          <Route path="/client-access" element={<ClientAccess />} />
          <Route path="/links" element={<Links />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
