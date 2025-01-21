import MaterialInwadsModel from "../Models/MaterialInwads.model.js";
import MaterialsModel from "../Models/Materials.model.js";

//get list of Material Inwards
export const getAllMaterialInwards = async (req, res) => {
  const { siteId } = req.params;
  if (!siteId) return res.status(400).json({ message: "Site ID is required" });
  try {
    const materials = await MaterialInwadsModel.find({ siteId: siteId })
      .populate("POid", "vendorId")
      .populate("POid.vendorId", "name");
    res.status(200).json(materials);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get MaterialInward details by ID
export const getMaterialInwardById = async (req, res) => {
  try {
    const { MIid } = req.params;
    const { siteId } = req.query;
    if (!MIid || !siteId)
      return res.status(400).json({ message: "MI ID and siteId is required" });
    const MI = await MaterialInwadsModel.findOne({ _id: MIid, siteId: siteId })
      .populate("POid")
      .populate("POid.vendorId")
      .populate("POid.order.productId")
      .populate("order.productId");
    res.status(200).json(MI);
  } catch (error) {
    res.status(500).json(error);
  }
};

//create MaterialInward
export const createMaterialInward = async (req, res) => {
  const { POid, vendorId, order, subTotal, tax, grandTotal, siteId } = req.body;
  if (
    !POid ||
    !order ||
    !vendorId ||
    !subTotal ||
    !tax ||
    !grandTotal ||
    !siteId
  )
    return res.status(400).json({ message: "Fill all the fields" });
  try {
    let matIds = [];
    order?.forEach((product) => {
      const newMat = new MaterialsModel({
        productId: product.productId,
        suppliedQty: product.suppliedQty,
        siteId,
        fromVendor: vendorId,
        unitPrice: product.unitPrice,
      });
      newMat.save();
      matIds.push(newMat._id);
    });
    const newMI = new MaterialInwadsModel({
      POid,
      materials: matIds,
      subTotal,
      tax,
      grandTotal,
      siteId,
    });
    await newMI.save();
    res.status(200).json(newMI);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get Materials
export const getMaterials = async (req, res) => {
  try {
    const { siteId } = req.query;
    if (!siteId)
      return res.status(400).json({ message: "Site ID is required" });
    await MaterialsModel.find({ siteId: siteId })
      .populate("productId")
      .populate("fromVendor", "name");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create Materials
export const editMaterial = async (req, res) => {
  const { matId } = req.params;
  try {
    const mat = await MaterialsModel.findById(matId);
    if (!mat) return res.status(404).json({ message: "Material not found" });
    const { usedQty } = req.body;
    mat.usedQty = usedQty;
    mat.availableQty = mat.availableQty - usedQty;
    await mat.save();
    res.status(200).json(mat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
