import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/main";
import DashboardLayout from "../components/layout/dashboard";
import Landing from "../pages/landing";
import Dashboard from "../pages/dashboard";
import Wallets from "../pages/wallets";
import Create from "../pages/create";
import Register from "../pages/register";
import WalletDetail from "../pages/wallet-detail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
    ],
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "wallets",
        element: <Wallets />,
      },
      {
        path: "create",
        element: <Create />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "wallet/:address",
        element: <WalletDetail />,
      },
    ],
  },
]);
