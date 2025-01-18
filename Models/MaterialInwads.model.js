import mongoose from "mongoose";

const MaterialInwardSchema = new mongoose.Schema(
  {
    POid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseOrders",
      required: true,
    },
    order: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        suppliedQty: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],
    subTotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sites",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MaterialInwards", MaterialInwardSchema);
