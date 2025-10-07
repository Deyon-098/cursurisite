import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import DemoCards from './pages/DemoCards';
import ManageCourses from './pages/ManageCourses';
import CourseLearning from './pages/CourseLearning';
import SuperAdmin from './pages/SuperAdmin';
import CourseBuilder from './pages/CourseBuilder';
import CourseEditor from './pages/CourseEditor';

// Component pentru scroll la top la schimbarea rutei
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}

// Component pentru a gestiona layout-ul bazat pe rută
function AppLayout() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isSuperAdmin = location.pathname === '/admindanu';
  const isCourseBuilder = location.pathname === '/course-builder';
  const isCourseEditor = location.pathname.startsWith('/edit-course/');

  if (isDashboard) {
    // Layout full-screen pentru Dashboard (fără Header/Footer)
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    );
  }

  if (isSuperAdmin) {
    // Layout full-screen pentru Super Admin (fără Header/Footer)
    return (
      <Routes>
        <Route path="/admindanu" element={<SuperAdmin />} />
      </Routes>
    );
  }

  if (isCourseBuilder) {
    // Layout full-screen pentru Course Builder (fără Header/Footer)
    return (
      <Routes>
        <Route path="/course-builder" element={<CourseBuilder />} />
      </Routes>
    );
  }

  if (isCourseEditor) {
    // Layout full-screen pentru Course Editor (fără Header/Footer)
    return (
      <Routes>
        <Route path="/edit-course/:id" element={<CourseEditor />} />
      </Routes>
    );
  }

  // Layout normal pentru toate celelalte pagini
  return (
    <>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/learn/:id" element={<CourseLearning />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/demo-cards" element={<DemoCards />} />
          <Route path="/manage-courses" element={<ManageCourses />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
