import clientRoutes from "./Routes/client.routes.js";
import productRoutes from "./Routes/product.routes.js"
import labourRoutes from "./Routes/labour.routes.js";
import vendorsRoutes from "./Routes/vendor.routes.js";
import supervisorRoutes from "./Routes/supervisors.routes.js"
import todoRoutes from "./Routes/todo.routes.js";


export const routing = (app) => {

app.use("/api/client",clientRoutes);
app.use("/api/product",productRoutes);
app.use("/api/labour",labourRoutes);
app.use("/api/vendors",vendorsRoutes);
app.use("/supervisors", supervisorRoutes);
app.use("/todo",todoRoutes);


};
