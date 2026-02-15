import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
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
      </Route>
    </Routes>
  );
}

export default App;
