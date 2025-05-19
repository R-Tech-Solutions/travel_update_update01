import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import PlacesRoute from "./pages/PlacesRoute";
import About from "./pages/About";
import BlogsDetails from "./pages/BlogsDetails";
import AOS from "aos";
import Service from "./components/Servic/Service";
import "aos/dist/aos.css";
import Blog from "./pages/Blog";
import PlaceView from "./components/Servic/PlaceView";
import FormComponent from "./components/Servic/Form";

const App = () => {
  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 900,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* <Route path="blogs" element={<Blogs />} /> */}
            {/* <Route path="blogs/:id" element={<BlogsDetails />} /> */}
            <Route path="best-places" element={<PlacesRoute />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NoPage />} />
            <Route path="Service" element={<Service />} />
            <Route path="Blog" element={<Blog />} />
            <Route path="PlaceView/:id" element={<PlaceView />} /> {/* Add this route */}
            <Route path="/Forms/:id" element={<FormComponent />} />

            </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
