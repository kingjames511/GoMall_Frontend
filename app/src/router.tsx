import { createBrowserRouter, useNavigate, useLocation } from "react-router";
import Home from "@/pages/Home";
import LoginPage from "@/pages/LoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import SignUpPage from "@/pages/SignUpPage";
import OTPPage from "@/pages/OTPPage";

const LoginPageWrapper = () => {
  const navigate = useNavigate();
  return (
    <LoginPage
      onNavigate={(page) => {
        if (page === "home") navigate("/");
        else if (page === "signup") navigate("/signup");
        else if (page === "forgot-password") navigate("/login/forgot-password");
      }}
    />
  );
};

const SignUpPageWrapper = () => {
  const navigate = useNavigate();
  return (
    <SignUpPage
      onNavigate={(page, data) => {
        if (page === "home") navigate("/");
        else if (page === "login") navigate("/login");
        else if (page === "otp") {
          navigate("/signup/verify", { state: { email: data?.email } });
        }
      }}
    />
  );
};

const ForgotPasswordPageWrapper = () => {
  const navigate = useNavigate();
  return (
    <ForgotPasswordPage
      onNavigate={(page) => {
        if (page === "home") navigate("/");
        else if (page === "login") navigate("/login");
      }}
    />
  );
};

const OTPPageWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;
  return (
    <OTPPage
      email={email}
      onNavigate={(page) => {
        if (page === "home") navigate("/");
      }}
    />
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginPageWrapper />,
  },
  {
    path: "/login/forgot-password",
    element: <ForgotPasswordPageWrapper />,
  },
  {
    path: "/signup",
    element: <SignUpPageWrapper />,
  },
  {
    path: "/signup/verify",
    element: <OTPPageWrapper />,
  },
]);
