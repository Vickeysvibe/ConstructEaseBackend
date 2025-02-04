import MaterialInward from '../models/MaterialInwads.model.js';
import Vendors from "../Models/Vendors.model.js"
import XLSX from 'xlsx';

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
        console.log("siteId",siteId)
        const { vendor, startDate, endDate } = req.body;
        const vendorDoc = await Vendors.findOne({ name: vendor });  
        console.log(vendorDoc)
        if (!vendorDoc) {
            return res.status(404).json({ success: false, message: 'Vendor not found.' });
        }

        const vendorId = vendorDoc._id;  

        const materials = await MaterialInward.find({
            siteId,
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          })
            
          
        console.log('new',materials)

        const reportData = [];
        materials.forEach((material) => {
            // Log POid to ensure vendorId is populated correctly
            if (material.POid && material.POid.vendorId) {
                console.log('Vendor:', material.POid.vendorId.name);  // Check vendor name
            }
        
            // Check if order is populated and is an array
            if (Array.isArray(material.order)) {
                material.order.forEach((orderItem) => {
                    // Log orderItem to verify productId is populated
                    console.log('Order Item:', orderItem);
                    
                    if (orderItem.productId) {
                        console.log('Product ID:', orderItem.productId);  // Check productId existence
                        if (orderItem.productId.name) {
                            console.log('Product Name:', orderItem.productId.name);  // Check product name
                        }
                    }
                    
                    // Push report data if productId is properly populated
                    if (orderItem.productId && orderItem.productId.name) {
                        reportData.push({
                            'Vendor Name': material.POid.vendorId.name,
                            'Product Name': orderItem.productId.name,
                            'Supplied Quantity': orderItem.suppliedQty,
                            'Unit Price': orderItem.unitPrice,
                            'Total Price': orderItem.suppliedQty * orderItem.unitPrice,
                            'Date': material.createdAt.toISOString().split('T')[0],
                        });
                    }
                });
            } else {
                console.warn('Order is not populated or not an array for material:', material);
            }
        });
        
        console.log('Report Data:', reportData);  // Final report data
        
        
        console.log(reportData)
        
       
        if (reportData.length === 0) {
            return res.status(404).json({ success: false, message: 'No data found for this vendor.' });
        }

        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendor Report');

        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Vendor_Report_${vendor}.xlsx`);  // Using vendor name in the filename

        res.send(excelBuffer);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
};