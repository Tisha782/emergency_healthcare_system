const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },
    patientName: { type: String, required: true, trim: true },
    notes: { type: String, default: "" },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", default: null },
    nearestHospital: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
