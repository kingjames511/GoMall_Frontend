import { createBrowserRouter, useNavigate, useLocation } from "react-router";
import Home from "@/pages/Home";
import LoginPage from "@/pages/LoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import SignUpPage from "@/pages/SignUpPage";
import OTPPage from "@/pages/OTPPage";
import StoresPage from "@/pages/StoresPage";
import StoreDetailPage from "@/pages/StoreDetailPage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import AboutPage from "@/pages/AboutPage";
import WishlistPage from "@/pages/WishlistPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import ProfilePage from "@/pages/ProfilePage";
import FAQsPage from "@/pages/FAQsPage";
import SupportPage from "@/pages/SupportPage";
import OrdersPage from "@/pages/OrdersPage";
import ComingSoonPage from "@/pages/ComingSoonPage";

const LoginPageWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirect");

  return (
    <LoginPage
      redirectTo={redirectTo}
      onNavigate={(page) => {
        if (page === "home") navigate(redirectTo || "/");
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
  {
    path: "/stores",
    element: <StoresPage />,
  },
  {
    path: "/stores/:id",
    element: <StoreDetailPage />,
  },
  {
    path: "/products",
    element: <ProductsPage />,
  },
  {
    path: "/products/:id",
    element: <ProductDetailPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/wishlist",
    element: <WishlistPage />,
  },
  {
    path: "/favourites",
    element: <WishlistPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  // Pages not built yet — show the Coming Soon placeholder
  {
    path: "/faqs",
    element: <FAQsPage />,
  },
  {
    path: "/faq",
    element: <FAQsPage />,
  },
  {
    path: "/support",
    element: <SupportPage />,
  },
  {
    path: "/contact",
    element: <SupportPage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
  },
  {
    path: "/my-orders",
    element: <OrdersPage />,
  },
  // Catch-all for any unknown route
  {
    path: "*",
    element: <ComingSoonPage />,
  },
]);

