import ChatForm from "../pages/chatForm/ChatForm.jsx";
import Login from "../pages/login/Login.jsx";
import Register from "../pages/register/Register.jsx";
import Wizard from "../pages/wizard/Wizard.jsx";
import Plans from "../pages/plans/Plans.jsx";

export const initialRoutes = () => {
  const routes = [
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/booking-wizard", component: Wizard },
    { path: "/chat", component: ChatForm },
    { path: "/plans", component: Plans },
  ];
  return routes;
};
