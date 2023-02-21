import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import { Navbar } from "./components/layout/Navbar";
import { Landing } from "./components/layout/Landing";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* <>
        <section className="container"> */}
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </>

          {/* </section>
      </> */}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
