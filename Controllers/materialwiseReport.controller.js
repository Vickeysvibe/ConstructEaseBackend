import MaterialInward from '../models/MaterialInwads.model.js';
import Vendors from "../Models/Vendors.model.js"
import PurchaseOrdersModel from "../Models/PurchaseOrders.model.js";
import XLSX from 'xlsx';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export const overallMaterialReport = async (req, res) => {
    try {
        const { siteId } = req.query;
        const { startDate, endDate } = req.body;


        const materials = await MaterialInward.find({
            siteId,
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        })
            .populate({
                path: 'POid',
                populate: { path: 'vendorId', model: 'Vendors' },
            })
            .populate('order.productId');

        const reportData = [];


        materials.forEach((material) => {
            material.order.forEach((orderItem) => {
                reportData.push({
                    'Vendor Name': material.POid.vendorId.name,
                    'Product Name': orderItem.productId.name,
                    'Supplied Quantity': orderItem.suppliedQty,
                    'Unit Price': orderItem.unitPrice,
                    'Total Price': orderItem.suppliedQty * orderItem.unitPrice,
                    'Date': material.createdAt.toISOString().split('T')[0],
                });
            });
        });

        if (reportData.length === 0) {
            return res.status(404).json({ success: false, message: 'No data found for the selected site and date range.' });
        }


        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendor Purchase Report');


        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Vendor_Purchase_Report.xlsx');

        res.send(excelBuffer);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const SingleVendorReport = async (req, res) => {
    try {
        const { siteId } = req.query;
        const { vendor, startDate, endDate } = req.body;

        console.log("siteId:", siteId, "vendor:", vendor, "startDate:", startDate, "endDate:", endDate);

        // Fetch vendor document
        const vendorDoc = await Vendors.findOne({ name: vendor });
        if (!vendorDoc) {
            return res.status(404).json({ success: false, message: "Vendor not found." });
        }
        const vendorId = vendorDoc._id;

        // Fetch materials linked to Purchase Orders for the given vendorId and siteId
        const materials = await MaterialInward.aggregate([
            { $match: { siteId: new ObjectId(siteId) } },
            {
                $lookup: {
                    from: "materials",
                    localField: "materials",
                    foreignField: "_id",
                    as: "materialDetails",
                },
            },
            {
                $lookup: {
                    from: "purchaseorders",
                    localField: "POid",
                    foreignField: "_id",
                    as: "PO",
                },
            },
            { $unwind: { path: "$PO", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "vendors",
                    localField: "PO.vendorId",
                    foreignField: "_id",
                    as: "PO.vendor",
                },
            },
            { $unwind: { path: "$PO.vendor", preserveNullAndEmptyArrays: true } },
            { $match: { "PO.vendor._id": new ObjectId(vendorId) } },

            // Ensure PO order exists before unwinding
            {
                $addFields: {
                    "PO.order": {
                        $ifNull: ["$PO.order", []] // Ensure it's an array
                    }
                }
            },
            { $unwind: { path: "$PO.order", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "products",
                    localField: "PO.order.productId",
                    foreignField: "_id",
                    as: "PO.order.productDetails",
                },
            },
            { $unwind: { path: "$PO.order.productDetails", preserveNullAndEmptyArrays: true } },
            
        ]);

        console.log("Fetched Materials with Product Details:", JSON.stringify(materials, null, 2));
        materials.forEach(material => {
            console.log(material.PO.order);
        });
        

        if (materials.length === 0) {
            return res.status(404).json({ success: false, message: "No data found for this vendor within the specified date range." });
        }

        const reportData = [];

        materials.forEach((material) => {
            if (!material.PO || !material.PO.order) {
                console.warn("Invalid or missing order in POid:", material.POid);
                return;
            }
            const orders = Array.isArray(material.PO.order) ? material.PO.order : [material.PO.order];

            orders.forEach((orderItem) => {
                if (!orderItem.productDetails || !orderItem.productDetails.name) {
                    console.warn("Invalid product reference in order:", orderItem);
                    return;
                }
                console.log('oo',orderItem)
                const materialDetail = material.materialDetails.find(
                    (mat) => mat.productId.toString() === orderItem.productDetails._id.toString()
                );
                
        
                if (!materialDetail) {
                    console.warn("No matching material details found for product:", orderItem.productDetails.name);
                    return;
                }
                const suppliedQty = materialDetail.suppliedQty || 0; // Assuming `suppliedQty` is in materialDetail
                const unitPrice = materialDetail.unitPrice || 0; // Assuming `unitPrice` is in materialDetail

                reportData.push({
                    "Vendor Name": material.PO.vendor.name,
                    "Product Name": orderItem.productDetails.name,
                    "Supplied Quantity": suppliedQty,
                    "Unit Price": unitPrice,
                    "Total Price": suppliedQty * unitPrice,
                    "Date": material.createdAt.toISOString().split("T")[0],
                });
            });
        });

        console.log("Final Report Data:", reportData);

        if (reportData.length === 0) {
            return res.status(404).json({ success: false, message: "No reportable data found." });
        }

        // Generate Excel report
        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Vendor Report");

        const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        // Set response headers for file download
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=Vendor_Report_${vendorDoc.name}.xlsx`);

        res.send(excelBuffer);
    } catch (error) {
        console.error("Error generating vendor report:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
