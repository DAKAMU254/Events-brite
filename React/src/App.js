import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import AddEvent from "./pages/event/AddEvent";
import Event from "./pages/event/Event";
import EditEvent from "./pages/event/EditEvent";
import Layout from "./layout/Layout";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import { EventProvider } from "./context/EventContext";
import { PrivateRoute, PublicRoute } from "./context/helper";

function App() {
  return (
    <BrowserRouter>
        <EventProvider>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              <Route element={<PublicRoute />}>
                <Route path='login' element={<Login />} />
                <Route path='signup' element={<Signup />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path='addevent' element={<AddEvent />} />
                <Route path='profile' element={<Profile />} />
                <Route path='contact' element={<Contact />} />
                <Route path='events/:id' element={<Event />} />
                <Route path='edit/:id' element={<EditEvent />} />
              </Route>
            </Route>
          </Routes>
        </EventProvider>
    </BrowserRouter>
  );
}

export default App;
