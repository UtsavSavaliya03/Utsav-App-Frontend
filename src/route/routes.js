import ChatForm from "../pages/chatForm/ChatForm.jsx";
import Login from "../pages/login/Login.jsx";
import Register from "../pages/register/Register.jsx";
import Wizard from "../pages/wizard/Wizard.jsx";
import Plans from "../pages/plans/Plans.jsx";
import Landing from "../pages/landing/Landing.jsx";
import Feedback from "../pages/feedback/Feedback.jsx";

export const initialRoutes = () => {
  const routes = [
    { path: "/", component: Landing },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/booking-wizard", component: Wizard },
    { path: "/job-application", component: ChatForm },
    { path: "/decision-interface", component: Plans },
    { path: "/feedback", component: Feedback },
  ];
  return routes;
};
