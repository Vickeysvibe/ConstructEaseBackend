import LabourAttendanceModel from "../Models/LabourAttendance.model.js";
import XLSX from "xlsx";
import mongoose from "mongoose";
import express from "express" // Or import express from 'express';
const app = express();

app.use(express.json()); 

export const laborReport = async (req, res) => {
  try {
    const { siteId, startDate, endDate, laborCategory, subCategory } = req.body;

    if (!req.body.siteId || !req.body.startDate || !req.body.endDate) {
      return res.status(400).json({ message: "siteId, startDate, and endDate are required" });
    }

    // Convert dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire day

    // Query attendance data
    const attendanceRecords = await LabourAttendanceModel.find({
      siteId: siteId,
      date: { $gte: start, $lte: end },
    }).populate("attendance.labourId");

    if (!attendanceRecords.length) {
      return res.status(404).json({
        message: "No attendance records found for the given criteria.",
      });
    }

    // Filter and process data
    const laborData = {};
    attendanceRecords.forEach((record) => {
      record.attendance.forEach((entry) => {
        const { labourId, shift, status } = entry;

        // Apply category and subcategory filters
        if (
          laborCategory &&
          laborCategory !== "ALL" &&
          labourId.category !== laborCategory
        )
          return;
        if (subCategory && labourId.subCategory !== subCategory) return;

        if (!laborData[labourId._id]) {
          laborData[labourId._id] = {
            name: labourId.name,
            phoneNo: labourId.phoneNo,
            category: labourId.category,
            subCategory: labourId.subCategory,
            wagesPerShift: labourId.wagesPerShift,
            daysPresent: 0,
            totalShifts: 0,
            totalWages: 0,
          };
        }

        if (status === "present") {
          laborData[labourId._id].daysPresent++;
          laborData[labourId._id].totalShifts += shift;
          laborData[labourId._id].totalWages += shift * labourId.wagesPerShift;
        }
      });
    });

    // Convert data to Excel
    const rows = Object.values(laborData).map((data) => ({
      Name: data.name,
      Phone: data.phoneNo,
      Category: data.category,
      SubCategory: data.subCategory,
      "Wages/Shift": data.wagesPerShift,
      "Days Present": data.daysPresent,
      "Total Shifts": data.totalShifts,
      "Total Wages": data.totalWages,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Labor Report");

    // Generate buffer and send file
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=LaborReport.xlsx"
    );
    res.type(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(excelBuffer);
  } catch (error) {
    console.error("Error generating labor report:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};
