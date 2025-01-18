import mongoose from "mongoose";

const SupervisorAttendanceSchema = new mongoose.Schema(
  {
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sites",
      required: true,
    },
    date: { type: Date, default: Date.now, required: true },
    attendance: [
      {
        supervisorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Supervisors",
          required: true,
        },
        location: { type: String, required: true },
        checkin: { type: [Date], default: [] },
        checkout: { type: [Date], default: [] },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model(
  "SupervisorAttendances",
  SupervisorAttendanceSchema
);
