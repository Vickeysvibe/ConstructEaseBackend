import mongoose from "mongoose";

const MaterialOutwardSchema = new mongoose.Schema(
  {
    materialInwardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaterialInwards",
      required: true,
    },
    order: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        availableQty: { type: Number, required: true },
        used: { type: Number, required: true },
      },
    ],
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sites",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MaterialOutwards", MaterialOutwardSchema);
