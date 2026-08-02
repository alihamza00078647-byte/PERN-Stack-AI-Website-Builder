import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Projects from "./pages/Projects";
import Myprojects from "./pages/Myprojects";
import Preview from "./pages/Preview";
import Community from "./pages/Community";
import View from "./pages/View";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";



function App() {

  const {pathname} = useLocation();

  const hide = pathname.startsWith('/projects/') && pathname !== '/projects' || 
        pathname.startsWith('/view/') ||  pathname.startsWith('/preview/');

  // const hideFooter = pathname.startsWith('/projects/');

  return (
    <>
      {!hide && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/projects/:projectId" element={<Projects />} />
        <Route path="/projects" element={<Myprojects />} />
        <Route path="/preview/:projectId" element={<Preview />} />
        <Route path="/preview/:projectId/:versionId" element={<Preview />} />
        <Route path="/community" element={<Community />} />
        <Route path="/view/:projectId" element={<View />} />
      </Routes>
      {!hide && <Footer />}
    </>
  )
}

export default App;