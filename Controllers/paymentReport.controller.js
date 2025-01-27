import Payments from "../Models/Payments.model.js"; 
import ExcelJS from "exceljs";

export const paymentReport = async (req, res) => {
    try {
        const { type } = req.body;
        const { siteId } = req.query;

        if (!type || !["vendor", "client", "labor", "others"].includes(type)) {
            return res.status(400).json({ message: "Invalid type provided" });
        }
        if (!siteId) {
            return res.status(400).json({ message: "Site ID is required" });
        }

        let projection = {};
        let columns = [];

        if (type === "vendor") {
            projection = { date: 1, description: 1, quantity: 1, unit: 1, costPerUnit: 1, amount: 1 };
            columns = [
                { header: "Date", key: "date", width: 15 },
                { header: "Description", key: "description", width: 25 },
                { header: "Quantity", key: "quantity", width: 10 },
                { header: "Unit", key: "unit", width: 10 },
                { header: "Cost per Unit", key: "costPerUnit", width: 15 },
                { header: "Amount", key: "amount", width: 15 },
            ];
        } else if (type === "client") {
            projection = { date: 1, paymentReceived: 1, paymentAs: 1, paymentBy: 1 };
            columns = [
                { header: "Date", key: "date", width: 15 },
                { header: "Payment Received", key: "paymentReceived", width: 20 },
                { header: "Payment As", key: "paymentAs", width: 15 },
                { header: "Payment By", key: "paymentBy", width: 15 },
            ];
        } else {
            // For labor and others
            projection = { date: 1, description: 1, amount: 1 };
            columns = [
                { header: "Date", key: "date", width: 15 },
                { header: "Description", key: "description", width: 25 },
                { header: "Amount", key: "amount", width: 15 },
            ];
        }

        const payments = await Payments.find({ type, siteId }).select(projection).lean();

        if (!payments.length) {
            return res.status(404).json({ message: "No payments found for the given criteria" });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Payments");

        worksheet.columns = columns;

        payments.forEach((payment) => {
            worksheet.addRow({
                ...payment,
                date: new Date(payment.date).toLocaleDateString(),
            });
        });

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=payments_${type}_${siteId}.xlsx`
        );
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        await workbook.xlsx.write(res);

        res.end();
    } catch (error) {
        console.error("Error generating Excel:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
