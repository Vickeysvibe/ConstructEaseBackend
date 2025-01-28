import jwt from 'jsonwebtoken';
import SupervisorAttendanceModel from '../Models/SupervisorAttendances.model.js';
import geocoder from '../Utils/geocoder.js'; 

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

export const checkin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id; 
    const role = decodedToken.role; 

    const { location } = req.body;
    const { siteId } = req.query;

    if (!location || !location.latitude || !location.longitude) {
      return res
        .status(400)
        .json({ message: 'Real-time location is required.' });
    }

    const [geocodedLocation] = await geocoder.reverse({
      lat: location.latitude,
      lon: location.longitude,
    });

    const address = geocodedLocation
      ? `${geocodedLocation.city}, ${geocodedLocation.state}`
      : 'Location not available';

    if (role === 'Supervisor') {
      if (!siteId) {
        return res.status(400).json({ message: 'Site ID is required.' });
      }

      const today = formatDate(new Date());

      let attendanceRecord = await SupervisorAttendanceModel.findOne({
        siteId,
        date: today,
      });

      if (!attendanceRecord) {
        attendanceRecord = new SupervisorAttendanceModel({
          siteId,
          date: today,
          attendance: [
            {
              supervisorId: userId,
              location: {
                address: address || 'Unknown address',
                latitude: location.latitude,
                longitude: location.longitude,
              },
              checkin: [new Date()],
              checkout: [new Date()],
            },
          ],
        });
      } else {
        const supervisorAttendance = attendanceRecord.attendance.find(
          (att) => att.supervisorId.toString() === userId
        );

        const now = new Date();
        if (supervisorAttendance) {
          supervisorAttendance.checkin.push(now);
          supervisorAttendance.checkout.push(now);
        } else {
          attendanceRecord.attendance.push({
            supervisorId: userId,
            location: {
              address: address || 'Unknown address',
              latitude: location.latitude,
              longitude: location.longitude,
            },
            checkin: [now],
            checkout: [now],
          });
        }
      }

      await attendanceRecord.save();
    }

    return res.status(200).json({ message: 'Check-in recorded successfully.' });
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

    const attendanceRecord = await SupervisorAttendanceModel.findOne({
      siteId,
      date: today,
    });

    if (!attendanceRecord) {
      return res.status(404).json({
        message: "No attendance record found for this site and date.",
      });
    }

    const supervisorAttendance = attendanceRecord.attendance.find(
      (att) => att.supervisorId.toString() === supervisorId
    );

    if (!supervisorAttendance) {
      return res
        .status(404)
        .json({ message: "No attendance found for this supervisor." });
    }

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