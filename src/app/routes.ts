import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { InputForm } from "./pages/InputForm";
import { MultiImpactDashboard } from "./pages/MultiImpactDashboard";
import { CO2Dashboard } from "./pages/CO2Dashboard";
import { Visualization3D } from "./pages/Visualization3D";
import { Prediction } from "./pages/Prediction";
import { Recommendations } from "./pages/Recommendations";
import { Auth } from "./pages/Auth";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/input",
    Component: InputForm,
  },
  {
    path: "/auth",
    Component: Auth
  },
  {
    path: "/dashboard",
    Component: MultiImpactDashboard,
  },
  {
    path: "/co2-dashboard",
    Component: CO2Dashboard,
  },
  {
    path: "/visualization",
    Component: Visualization3D,
  },
  {
    path: "/prediction",
    Component: Prediction,
  },
  {
    path: "/recommendations",
    Component: Recommendations,
  },
]);
