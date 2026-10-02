const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema(
  {
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
    bedNumber: { type: Number, required: true },
    bedType: { type: String, default: "General" },
    status: { type: String, enum: ["Available", "Occupied"], default: "Available" },
  },
  { timestamps: true }
);

bedSchema.index({ hospital: 1, bedNumber: 1 }, { unique: true });

module.exports = mongoose.model("Bed", bedSchema);
