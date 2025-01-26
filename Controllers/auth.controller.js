import EngineersModel from "../Models/Engineers.model.js";
import SupervisorsModel from "../Models/Supervisors.model.js";
import SupervisorAttendanceModel from "../Models/SupervisorAttendances.model.js";
import bcrypt from "bcrypt";
import generateJwt from "../Utils/generateJWTtoken.js";
import geocoder from "../Utils/geocoder.js";

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

export const login = async (req, res) => {
  try {
    const { email, password, location } = req.body;
    const { siteId } = req.query;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Not all fields have been entered." });
    }

    /* if (!location || !location.latitude || !location.longitude) {
      return res
        .status(400)
        .json({ message: "Real-time location is required." });
    } */

    let user = {};

    user = await EngineersModel.findOne({ email });
    if (!user) {
      user = await SupervisorsModel.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "No account with this email has been registered." });
      }
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const role = user.companyName ? "Engineer" : "Supervisor";
    const token = await generateJwt(user, role);
    /* 
    const [geocodedLocation] = await geocoder.reverse({
      lat: location.latitude,
      lon: location.longitude,
    });

    const address = geocodedLocation
      ? `${geocodedLocation.city}, ${geocodedLocation.state}`
      : "Location not available";

    if (role === "Supervisor") {
      if (!siteId) {
        return res.status(400).json({ message: "Site ID is required." });
      }

      const today = formatDate(new Date());

      let attendanceRecord = await SupervisorAttendanceModel.findOne({
        siteId,
        date: today,
      });

      if (!attendanceRecord) {
        // Create a new attendance record if it doesn't exist
        attendanceRecord = new SupervisorAttendanceModel({
          siteId,
          date: today,
          attendance: [
            {
              supervisorId: user._id,
              location: {
                address: address || "Unknown address",
                latitude: location.latitude,
                longitude: location.longitude,
              },
              checkin: [new Date()],
              checkout: [new Date()],
            },
          ],
        });
      } else {
        // Push new check-in and default checkout for the existing record
        const supervisorAttendance = attendanceRecord.attendance.find(
          (att) => att.supervisorId.toString() === user._id.toString()
        );

        const now = new Date();
        if (supervisorAttendance) {
          supervisorAttendance.checkin.push(now);
          supervisorAttendance.checkout.push(now);
        } else {
          attendanceRecord.attendance.push({
            supervisorId: user._id,
            location: {
              address: address || "Unknown address",
              latitude: location.latitude,
              longitude: location.longitude,
            },
            checkin: [now],
            checkout: [now],
          });
        }
      }

      await attendanceRecord.save();
    } */

    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const checkout = async (req, res) => {
  try {
    const { supervisorId } = req.body;
    const { siteId } = req.query;

    if (!supervisorId || !siteId) {
      return res
        .status(400)
        .json({ message: "Supervisor ID and Site ID are required." });
    }

    const today = formatDate(new Date());
    const now = new Date();

    // Find the attendance record for the site and date
    const attendanceRecord = await SupervisorAttendanceModel.findOne({
      siteId,
      date: today,
    });

    if (!attendanceRecord) {
      return res.status(404).json({
        message: "No attendance record found for this site and date.",
      });
    }

    // Find the supervisor's attendance entry
    const supervisorAttendance = attendanceRecord.attendance.find(
      (att) => att.supervisorId.toString() === supervisorId
    );

    if (!supervisorAttendance) {
      return res
        .status(404)
        .json({ message: "No attendance found for this supervisor." });
    }

    // Update the last default checkout time with the actual checkout time
    if (supervisorAttendance.checkout.length > 0) {
      supervisorAttendance.checkout[supervisorAttendance.checkout.length - 1] =
        now;
    } else {
      return res
        .status(400)
        .json({ message: "No check-in exists to perform checkout." });
    }

    await attendanceRecord.save();
    return res
      .status(200)
      .json({ message: "Checkout time updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
