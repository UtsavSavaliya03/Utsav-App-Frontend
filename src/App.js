import Route from "./route/Route.jsx";
import { initialRoutes } from "./route/routes.js";
import './App.css';

const generateRoutes = (routes) => {
  return routes.map(({ component: Component, ...rest }) => {
    return {
      // Here i paased component in element but befor i wrapped it in a custom created Route component
      element: (
        <Route {...rest}>
          <Component />
        </Route>
      ),
      ...rest,
    };
  });
};

const AppWrapper = generateRoutes(initialRoutes());

export default AppWrapper;