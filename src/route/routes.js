import ChatForm from "../pages/chatForm/ChatForm.jsx";
import Login from "../pages/login/Login.jsx";
import Register from "../pages/register/Register.jsx";
import Wizard from "../pages/wizard/Wizard.jsx";

export const initialRoutes = () => {
  const routes = [
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/booking-wizard", component: Wizard },
    { path: "/chat", component: ChatForm },
  ];
  return routes;
};
