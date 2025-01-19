import MaterialInwadsModel from "../Models/MaterialInwads.model.js";
import MaterialOutwardsModel from "../Models/MaterialOutwards.model.js";

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

//get list of Material Outwards
export const getAllMaterialOutwards = async (req, res) => {
  const { siteId } = req.params;
  if (!siteId) return res.status(400).json({ message: "Site ID is required" });
  try {
    const materials = await MaterialOutwardsModel.find({ siteId: siteId })
      .populate("materialInwardId", "POid")
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

//get MaterialOutward details by ID
export const getMaterialOutwardById = async (req, res) => {
  try {
    const { MIid } = req.params;
    const { siteId } = req.query;
    if (!MIid || !siteId)
      return res.status(400).json({ message: "MI ID and siteId is required" });
    const MI = await MaterialOutwardsModel.findOne({
      _id: MIid,
      siteId: siteId,
    })
      .populate("materialInwardId")
      .populate("order.productId")
      .populate("materialInwardId.POid")
      .populate("materialInwardId.POid.vendorId")
      .populate("materialInwardId.order.productId");
    res.status(200).json(MI);
  } catch (error) {
    res.status(500).json(error);
  }
};

//create MaterialInward
export const createMaterialInward = async (req, res) => {
  const { POid, order, subTotal, tax, grandTotal, siteId } = req.body;
  if (!POid || !order || !subTotal || !tax || !grandTotal || !siteId)
    return res.status(400).json({ message: "Fill all the fields" });
  try {
    const newMI = new MaterialInwadsModel({
      POid,
      order,
      subTotal,
      tax,
      grandTotal,
      siteId,
    });
    await newMI.save();
    res.status(200).json(newMI);
  } catch (error) {
    res.status(500).json(error);
  }
};

//create materialOutward
export const createMaterialOutward = async (req, res) => {
  const { materialInwardId, order, siteId } = req.body;
  if (!materialInwardId || !order || !siteId)
    return res.status(400).json({ message: "Fill all the fields" });
  try {
    const newMO = new MaterialOutwardsModel({
      materialInwardId,
      order,
      siteId,
    });
    await newMO.save();
    res.status(200).json(newMO);
  } catch (error) {
    res.status(500).json(error);
  }
};
