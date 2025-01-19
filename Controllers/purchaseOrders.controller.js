import ProductsModel from "../Models/Products.model.js";
import PurchaseOrdersModel from "../Models/PurchaseOrders.model.js";
import PurchaseReturnsModel from "../Models/PurchaseReturns.model.js";
import SitesModel from "../Models/Sites.model.js";
import VendorsModel from "../Models/Vendors.model.js";

// get all purchase orders for the site
export const getAllPos = async (req, res) => {
  try {
    const { siteId } = req.query;
    const pos = await PurchaseOrdersModel.find({ siteId }).populate(
      "vendorId",
      "name"
    );
    if (pos.length === 0)
      return res.status(404).json({ message: "No purchase orders found" });
    res.status(200).json(pos);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// get all purchase returns for the site
export const getAllPrs = async (req, res) => {
  try {
    const { siteId } = req.query;
    const prs = await PurchaseReturnsModel.find({ siteId })
      .populate("POid", "vendorId")
      .populate("POid.vendorId", "name");
    if (prs.length === 0)
      return res.status(404).json({ message: "No purchase returns found" });
    res.status(200).json(prs);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

//get particular Purchase order
export const getPo = async (req, res) => {
  try {
    const { poid } = req.params;
    const pos = await PurchaseOrdersModel.findById(poid)
      .populate("vendorId siteId")
      .populate("order.productId");
    if (!pos.siteId)
      return res.status(404).json({ message: "No purchase orders found" });
    res.status(200).json(pos);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

//get particular Purchase return
export const getPr = async (req, res) => {
  try {
    const { prid } = req.params;
    const prs = await PurchaseReturnsModel.findById(prid)
      .populate("POid", "vendorId")
      .populate("POid.vendorId POid.siteId")
      .populate("order.productId");
    if (!prs.siteId)
      return res.status(404).json({ message: "No purchase returns found" });
    res.status(200).json(prs);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

//suggestions for creation
export const helper = async (req, res) => {
  try {
    const { siteId } = req.query;
    const vendors = await VendorsModel.find({ siteId });
    const products = await ProductsModel.find({ siteId });
    if (!vendors || !products)
      return res.status(404).json({ message: "No vendors or products found" });
    res.status(200).json({ vendors: vendors, products: products });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

//create purchase order
export const CreatePo = async (req, res) => {
  try {
    const { siteId } = req.query;
    const { vendorId, date, transport, order } = req.body;
    if (order.length === 0 || !vendorId || !date || !transport)
      return res.status(400).json({ message: "fill all the fields" });
    const po = await PurchaseOrdersModel.create({
      siteId,
      vendorId,
      date,
      transport,
      order,
    });
    await po.save();

    const PurOrder = await PurchaseOrdersModel.findById(po._id)
      .populate("vendorId siteId")
      .populate("order.productId")
      .populate("siteId.engineerId");

    // Generate HTML from Template
    const generateHTML = (templatePath, data) => {
      const templateSource = fs.readFileSync(templatePath, "utf8");
      const template = Handlebars.compile(templateSource);
      return template(data);
    };

    // Generate PDF and Return as Buffer
    const generatePDFBuffer = async (html) => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load" });
      const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
      await browser.close();
      return pdfBuffer;
    };

    // Main Execution
    const html = generateHTML("../PoTemplates/template1.html", { PurOrder });
    const pdfBuffer = await generatePDFBuffer(html);
    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=purchase_order.pdf"
    );

    // Send PDF Buffer as response
    res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

//create purchase order
export const CreatePr = async (req, res) => {
  try {
    const { siteId } = req.query;
    const { vendorId, subTotal, grandTotal, tax, order } = req.body;
    if (order.length === 0 || !vendorId || !subTotal || !grandTotal || !tax)
      return res.status(400).json({ message: "fill all the fields" });
    const pr = await PurchaseReturnsModel.create({
      siteId,
      vendorId,
      subTotal,
      grandTotal,
      tax,
      order,
    });
    await pr.save();
    res.status(200).json(pr);

    // const PurOrder = await PurchaseOrdersModel.findById(pr._id)
    //   .populate("vendorId siteId")
    //   .populate("order.productId")
    //   .populate("siteId.engineerId");

    // // Generate HTML from Template
    // const generateHTML = (templatePath, data) => {
    //   const templateSource = fs.readFileSync(templatePath, "utf8");
    //   const template = Handlebars.compile(templateSource);
    //   return template(data);
    // };

    // // Generate PDF and Return as Buffer
    // const generatePDFBuffer = async (html) => {
    //   const browser = await puppeteer.launch();
    //   const page = await browser.newPage();
    //   await page.setContent(html, { waitUntil: "load" });
    //   const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    //   await browser.close();
    //   return pdfBuffer;
    // };

    // // Main Execution
    // const html = generateHTML("../PoTemplates/template1.html", { PurOrder });
    // const pdfBuffer = await generatePDFBuffer(html);
    // // Set response headers
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader(
    //   "Content-Disposition",
    //   "attachment; filename=purchase_order.pdf"
    // );

    // // Send PDF Buffer as response
    // res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
