import menuRoutes from "./menu.js";
import stripeRoutes from "./stripe.js";

const constructorMethod = (app) => {
  app.use("/menu", menuRoutes);
  app.use("/stripe", stripeRoutes);
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;
