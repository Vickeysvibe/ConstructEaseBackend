import clientRoutes from "./Routes/client.routes.js";
import productRoutes from "./Routes/product.routes.js";
import labourRoutes from "./Routes/labour.routes.js";
import vendorsRoutes from "./Routes/vendor.routes.js";
import supervisorRoutes from "./Routes/supervisors.routes.js";

import PurchaseOrders from "./Routes/purchaseOrders.routes.js";
import sites from "./Routes/sites.routes.js";
import auth from "./Routes/auth.routes.js";
import testing from "./testing/testing.routes.js";

export const routing = (app) => {
  app.use("/api/auth", auth);
  app.use("/api/client", clientRoutes);
  app.use("/api/product", productRoutes);
  app.use("/api/labour", labourRoutes);
  app.use("/api/vendors", vendorsRoutes);
  app.use("/api/supervisors", supervisorRoutes);
  app.use("/api/pos", PurchaseOrders);
  app.use("/api/sites", sites);
  app.use("/api/testing", testing);
};
