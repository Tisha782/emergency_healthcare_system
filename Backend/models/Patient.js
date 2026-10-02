const mongoose = require("mongoose");

const personalInfoSchema = new mongoose.Schema(
  {
    age: { type: String, default: "" },
    gender: { type: String, default: "" },
    address: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
  },
  { _id: false }
);

const medicalInfoSchema = new mongoose.Schema(
  {
    bloodGroup: { type: String, default: "" },
    allergies: { type: String, default: "" },
    conditions: { type: String, default: "" },
    medications: { type: String, default: "" },
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    personalInfo: { type: personalInfoSchema, default: () => ({}) },
    medicalInfo: { type: medicalInfoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
