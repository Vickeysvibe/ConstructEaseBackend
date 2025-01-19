import PurchaseOrders from "./Routes/purchaseOrders.routes.js";
import sites from "./Routes/sites.routes.js";
import testing from "./testing/testing.routes.js";

export const routing = (app) => {
  app.use("/api/pos", PurchaseOrders);
  app.use("/api/sites", sites);
  app.use("/api/testing", testing);
};
