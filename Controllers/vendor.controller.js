import Vendors from "../Models/Vendors.model.js";
import PurchaseOrders from "../Models/PurchaseOrders.model.js"
import XLSX from "xlsx";

export const createVendor = async (req, res) => {
    try {
        const { name, ownerName, address, gstIn, phoneNo } = req.body;
        const { siteId } = req.query;
        if (!name || !ownerName || !address || !gstIn || !phoneNo || !siteId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingVendor = await Vendors.findOne({ name, siteId })
        console.log(existingVendor)
        if(existingVendor)
        {
            return res.status(400).json({
                message : "existing vendor"
            })
        }
        const newVendor = new Vendors({ name, ownerName, address, gstIn, phoneNo, siteId });
        await newVendor.save();
        res.status(201).json({ message: "Vendor created successfully", vendor: newVendor });
    } catch (error) {
        res.status(500).json({ message: error.message, redirectUrl: 'http://.....' });
    }
};

export const updateVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const updatedData = req.body;
        const { siteId } = req.query;
        updatedData.siteId = siteId;
        const updatedVendor = await Vendors.findByIdAndUpdate(vendorId, updatedData, { new: true });
        if (!updatedVendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        res.status(200).json({ message: "Vendor updated successfully", vendor: updatedVendor });
    } catch (error) {
        res.status(500).json({ message: error.message, redirectUrl: 'http://.....' });
    }
};

export const getAllVendors = async (req, res) => {
    try {
        const { siteId } = req.query;
        let vendors;

        if (siteId) {
            vendors = await Vendors.find({ siteId }).populate("siteId", "name");
        } else {
            vendors = await Vendors.find().populate("siteId", "name");
        }

        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message, redirectUrl: 'http://.....' });
    }
};

export const getVendorById = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const vendor = await Vendors.findById(vendorId).populate("siteId", "name");
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message, redirectUrl: 'http://.....' });
    }
};

export const uploadExcel = async (req, res) => {
    try {
        const { siteId } = req.query;

        if (!siteId) {
            return res.status(400).json({ error: "Site ID is required in the query" });
        }
        if (!req.files || !req.files.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const file = req.files.file;
        const workbook = XLSX.read(file.data, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const vendors = [];

        jsonData.forEach((row) => {
            const { name, ownerName, address, gstIn, phoneNo } = row;
            if (name && ownerName && address && gstIn && phoneNo) {
                vendors.push({ name, ownerName, address, gstIn, phoneNo, siteId });
            }
        });

        if (vendors.length === 0) {
            return res.status(400).json({ error: "No valid data found in the file" });
        }

        await Vendors.insertMany(vendors);
        res.status(200).json({ message: "Vendors uploaded successfully", vendors });
    } catch (error) {
        res.status(500).json({ message: error.message, redirectUrl: 'http://.....' });
    }
};

export const deleteVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const siteId = req.query;
        const existingPurchaseOrder = await PurchaseOrders.findOne({
            vendorId: vendorId,
            siteId: siteId
        });
        
        if (existingPurchaseOrder) {
            return res.status(400).json({
                message: "Cannot delete vendor because it is associated with a purchase order."
            });
        }

        const deletedVendor = await Vendors.findByIdAndDelete(vendorId);

        if (!deletedVendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        res.status(200).json({ message: "Vendor deleted successfully", vendor: deletedVendor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

