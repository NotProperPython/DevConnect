import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import store from "./store";
import Alert from "./components/layout/Alert";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/auth";
import { useEffect } from "react";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoutes from "./components/routing/PrivateRoutes";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
        <section className="container">
          <Alert />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/profile/:id" element={<Profile />} />

            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/add-experience" element={<AddExperience />} />
              <Route path="/add-education" element={<AddEducation />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/post/:id" element={<Post />} />
            </Route>
          </Routes>
        </section>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
