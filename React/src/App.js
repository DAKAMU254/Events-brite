import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import "./App.css";
import Layout from "./layout/Layout";
import AddEvent from "./pages/AddEvent";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import { AuthProvider } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import Event from "./pages/Event";
import EditEvent from "./pages/EditEvent";


function App() {
  return (
  <BrowserRouter>
    <AuthProvider>
      <EventProvider>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="addevent" element={<AddEvent />} />
            <Route path="profile" element={<Profile />} />
            <Route path="contact" element={<Contact />}/>
            <Route path="events/:id" element={<Event/>}/>
            <Route path="edit/:id" element={<EditEvent />} />
          </Route>
        </Routes>
      </EventProvider>
    </AuthProvider>
  </BrowserRouter>
  );
}

export default App;
