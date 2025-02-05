import MaterialsModel from "../Models/Materials.model.js";
import ProductsModel from "../Models/Products.model.js";
import PurchaseOrdersModel from "../Models/PurchaseOrders.model.js";
import PurchaseReturnsModel from "../Models/PurchaseReturns.model.js";
import SitesModel from "../Models/Sites.model.js";
import VendorsModel from "../Models/Vendors.model.js";
import fs from "fs";
import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import MaterialInwards from "../models/MaterialInwads.model.js";
import path from "path";
// get all purchase orders for the site
export const getAllPos = async (req, res) => {
  try {
    const { siteId, mi } = req.query;

    if (!siteId) {
      return res.status(400).json({ message: "Site ID is required" });
    }

    const pos = await PurchaseOrdersModel.find({ siteId })
      .populate("vendorId", "name")
      .lean();

    console.log(pos);
    let data = [];

    if (mi) {
      const MIS = await MaterialInwards.find({ siteId }).select("POid");
      const miPOids = new Set(MIS.map((m) => m.POid.toString()));

      data = pos
        .filter((po) => !miPOids.has(po._id.toString()))
        .map((po) => ({
          POid: po._id,
          vendorName: po?.vendorId?.name || "unknown",
          date: po.date,
          transport: po.transport,
          orderCount: po.order.length,
        }));

      return res.status(200).json(data);
    }

    data = pos.map((po) => ({
      POid: po._id,
      vendorName: po?.vendorId?.name || "unknown",
      date: po.date,
      transport: po.transport,
      orderCount: po.order.length,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
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
      .populate({
        path: "POid",
        populate: {
          path: "vendorId",
          select: "name",
        },
      })
      .lean();
    console.log(prs);
    let data = [];
    prs.map((po) => {
      const d = {
        id: po._id,
        vendorName: po?.POid.vendorId?.name || "unknown",
        date: po?.POid.date,
        transport: po.POid.transport,
        orderCount: po.order.length,
      };
      data.push(d);
    });
    res.status(200).json(data);
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

//get particular Purchase order for pr
export const getPoForPr = async (req, res) => {
  try {
    const { poid } = req.params;

    // Fetch the purchase order with vendor and site details
    const pos = await PurchaseOrdersModel.findById(poid)
      .populate("vendorId siteId")
      .lean();

    if (!pos) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    if (!pos.siteId) {
      return res
        .status(404)
        .json({ message: "No site associated with this purchase order" });
    }

    // Extract product IDs from the order
    const productIds = pos.order.map((item) => item.productId);

    // Fetch all related materials in one query (optimized)
    const materials = await MaterialsModel.find({
      productId: { $in: productIds },
    })
      .populate("productId")
      .lean();

    res.status(200).json({ pos, materials });
  } catch (error) {
    console.error("Error fetching purchase order:", error);
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
      .populate({
        path: "POid",
        populate: {
          path: "vendorId",
        },
      })
      .populate({
        path: "order.materialId",
        populate: "productId",
      });
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
    const { vendorId, date, transport, order, template } = req.body;
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
      .populate("vendorId") // Populate vendor details
      .populate({
        path: "siteId", // Populate site details
        populate: [
          { path: "engineerId", model: "Engineers" }, // Populate engineer within site
        ],
      })
      .populate({
        path: "order.productId", // Populate products in the order
        populate: { path: "siteId", model: "Sites" }, // Nested population: Product -> Site
      })
      .lean();
    PurOrder.date = new Date(PurOrder.date).toLocaleDateString("en-US");

    // Generate HTML from Template
    const generateHTML = (templatePath, data) => {
      const templateSource = fs.readFileSync(templatePath, "utf8");
      const template = Handlebars.compile(templateSource);
      return template(data);
    };

    // Generate PDF and Return as Buffer
    const generatePDFBuffer = async (html) => {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "load" });
        const pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
        });
        await browser.close();
        return pdfBuffer;
      } catch (error) {
        console.error("Error generating PDF:", error);
        throw new Error("PDF generation failed");
      }
    };

    // Main Execution
    const html = generateHTML(
      `./PoTemplates/template${template || 1}.html`,
      PurOrder
    );
    const pdfBuffer = await generatePDFBuffer(html);

    // Set response headers to send PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=purchase_order.pdf"
    );

    // Send PDF Buffer as response
    res.end(pdfBuffer);
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
    const { edit } = req.query;
    const { siteId } = req.query;
    const { vendorId, subTotal, grandTotal, tax, order, POid } = req.body;

    // Validate required fields
    if (!order?.length || !vendorId || !subTotal || !grandTotal || tax) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (edit) {
      // Updating an existing purchase return
      const updatedPR = await PurchaseReturnsModel.findByIdAndUpdate(
        POid,
        { subTotal, grandTotal, tax, order },
        { new: true }
      );

      if (!updatedPR) {
        return res.status(404).json({ message: "Purchase return not found" });
      }

      return res
        .status(200)
        .json({ message: "Purchase return updated", data: updatedPR });
    } else {
      // Creating a new purchase return
      const matIds = await Promise.all(
        order.map(async (product) => {
          const updatedMaterial = await MaterialsModel.findByIdAndUpdate(
            product.MatId,
            { availableQty: product.availableQty },
            { new: true }
          );

          if (!updatedMaterial) {
            throw new Error(`Material with ID ${product.MatId} not found`);
          }

          return {
            materialId: updatedMaterial._id,
            returnQty: product.returnQty,
          };
        })
      );

      const newPR = await PurchaseReturnsModel.create({
        POid,
        siteId,
        vendorId,
        subTotal,
        grandTotal,
        tax,
        order: matIds,
      });

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
      res.status(200).json("over");
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
