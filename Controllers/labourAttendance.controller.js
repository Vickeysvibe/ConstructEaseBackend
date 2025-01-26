import mongoose from "mongoose";
import LabourAttendanceModel from "../Models/LabourAttendance.model.js";
import LabourModel from "../Models/Labors.model.js";
import SupervisorAttendancesModel from "../Models/SupervisorAttendances.model.js";
import SupervisorsModel from "../Models/Supervisors.model.js";

export const attendance = async (req, res) => {
    try {
      const { labourIds } = req.body; 
      const { siteId } = req.query;  
  
      if (!labourIds || labourIds.length === 0) {
        return res.status(400).json({ message: "No labour IDs provided" });
      }
  
      if (!siteId) {
        return res.status(400).json({ message: "siteId is required" });
      }
  
      const currentDate = new Date().setHours(0, 0, 0, 0);
  
      let attendanceDoc = await LabourAttendanceModel.findOne({
        siteId,
        date: currentDate,
      });
  
      if (!attendanceDoc) {
        attendanceDoc = new LabourAttendanceModel({
          siteId,
          date: currentDate,
          attendance: [],
        });
      }
  
      labourIds.forEach((labourId) => {
        attendanceDoc.attendance.push({
          labourId,
          status: "present", 
          shift: 1, 
        });
      });
  
      await attendanceDoc.save();
      console.log("document stored");
  
      const populatedDoc = await LabourAttendanceModel.findOne({
        siteId,
        date: currentDate,
      })
        .populate("attendance.labourId", "name category wagesPerShift")
        .select("attendance");
  
      const attendanceResponse = populatedDoc.attendance.map((entry) => {
        const labour = entry.labourId;
        const shift = entry.shift || 1;
        const wagesPerShift = labour.wagesPerShift || 0;
        const total = shift * wagesPerShift;
  
        return {
          Name: labour.name,
          Category: labour.category,
          Shift: shift,
          WagesPerShift: wagesPerShift,
          Total: total,
        };
      });
  
      res.status(200).json({
        Attendance: attendanceResponse,
      });
    } catch (error) {
      console.error("Error in attendance:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };
  

export const getLabours = async (req, res) => {
    try {
      const { siteId } = req.query; 
  
      if (!siteId) {
        return res.status(400).json({ message: "siteId is required" });
      }
        const labourData = await LabourModel.find({ siteId });
        const labourDetails = labourData.map((labour) => ({
        name: labour.name,
        category: labour.category,
        subCategory: labour.subCategory,
        wagesPerShift: labour.wagesPerShift,
      }));
  
      const subCategoryCounts = await LabourModel.aggregate([
        { $match: { siteId:new mongoose.Types.ObjectId(siteId) } },
        {
          $group: {
            _id: { category: "$category", subCategory: "$subCategory" },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.category",
            subCategories: {
              $push: {
                subCategory: "$_id.subCategory",
                count: "$count",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            subCategories: "$subCategories",
          },
        },
      ]);
  
      res.status(200).json({
        labourDetails,
        subCategoryCounts,
      });
    } catch (error) {
      console.error("Error fetching labour data:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
};

export const updateShift = async (req, res) => {
  try {
    const { labourId, newShift } = req.body; 
    const { siteId } = req.query;
    const currentDate = new Date().setHours(0, 0, 0, 0); // Normalize date

    if (!labourId || !newShift) {
      return res.status(400).json({ message: "Labour ID and new shift are required." });
    }

    if (!siteId) {
      return res.status(400).json({ message: "Site ID is required." });
    }
    const attendanceDoc = await LabourAttendanceModel.findOne({
      siteId,
      date: currentDate,
    });

    if (!attendanceDoc) {
      return res.status(404).json({ message: "Attendance record not found for the site and date." });
    }

    // Find the specific labor entry in the attendance array
    const laborEntry = attendanceDoc.attendance.find(
      (entry) => entry.labourId.toString() === labourId
    );

    if (!laborEntry) {
      return res.status(404).json({ message: "Labour not found in attendance records." });
    }
    laborEntry.shift = newShift;
    await attendanceDoc.save();

    res.status(200).json({ message: "Shift updated successfully."});
  } catch (error) {
    console.error("Error updating shift:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


export const getSupervisors = async (req, res) => {
  try {
    const { siteId } = req.query;

    if (!siteId) {
      return res.status(400).json({ message: "Site ID is required." });
    }
    const supervisorsAttendance = await SupervisorAttendancesModel.find({ siteId })
      .populate("attendance.supervisorId", "name") 
      .select("attendance.location attendance.checkin attendance.checkout"); 

    const formattedAttendance = supervisorsAttendance.flatMap((record) => {
      return record.attendance.flatMap((entry) => {
        if (entry.checkin && entry.checkout) {
          return entry.checkin.map((checkinTime, index) => {
            const checkoutTime = entry.checkout[index] || null;
            return {
              name: entry.supervisorId?.name || "Unknown", 
              location: entry.location?.address || "No location provided",
              loginTime: checkinTime, 
              logoutTime: checkoutTime, 
            };
          });
        }
        return []; 
      });
    });

    res.status(200).json(formattedAttendance);
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
