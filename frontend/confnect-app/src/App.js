import HomeView from "./features/home_view";
import LoginView from "./features/login_view";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomeView />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const isAuth = () => {
  return !!localStorage.getItem("token");
};

const PrivateRoute = ({ children }) => {
  return isAuth() ? children : <Navigate to="/login" />;
};
