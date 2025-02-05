import MaterialInward from '../models/MaterialInwads.model.js';
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
        const { vendorId, startDate, endDate } = req.body;


        const materials = await MaterialInward.find({
            siteId,
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        })
            .populate({
                path: 'POid',
                match: { vendorId },
                populate: { path: 'vendorId', model: 'Vendors' },
            })
            .populate('order.productId');

        const reportData = [];

        materials.forEach((material) => {
            if (material.POid) {
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
            }
        });

        if (reportData.length === 0) {
            return res.status(404).json({ success: false, message: 'No data found for this vendor.' });
        }

        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendor Report');

        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Vendor_Report_${vendorId}.xlsx`);

        res.send(excelBuffer);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
