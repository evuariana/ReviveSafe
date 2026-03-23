import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/main";
import DashboardLayout from "../components/layout/dashboard";
import Landing from "../pages/landing";
import Dashboard from "../pages/dashboard";
import Inbox from "../pages/inbox";
import Wallets from "../pages/wallets";
import Proposals from "../pages/proposals";
import Activity from "../pages/activity";
import Create from "../pages/create";
import ImportWallet from "../pages/import-wallet";
import Register from "../pages/register";
import WalletDetail from "../pages/wallet-detail";
import Deploy from "../pages/deploy";

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
        path: "inbox",
        element: <Inbox />,
      },
      {
        path: "wallets",
        element: <Wallets />,
      },
      {
        path: "proposals",
        element: <Proposals />,
      },
      {
        path: "activity",
        element: <Activity />,
      },
      {
        path: "create",
        element: <Create />,
      },
      {
        path: "import",
        element: <ImportWallet />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "wallet/:address",
        element: <WalletDetail />,
      },
      {
        path: "deploy",
        element: <Deploy />,
      },
    ],
  },
]);
