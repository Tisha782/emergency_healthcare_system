const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const { protectPatient, protectAdmin } = require("../middleware/auth");

const router = express.Router();

function toPublicPatient(patient) {
  return {
    id: patient._id,
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    personalInfo: patient.personalInfo,
    medicalInfo: patient.medicalInfo,
  };
}

function signPatientToken(patient) {
  return jwt.sign({ id: patient._id.toString(), role: "patient" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "Please fill in every field." });
    }

    const existing = await Patient.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await Patient.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      password: hashedPassword,
    });

    res.status(201).json({ success: true, patient: toPublicPatient(patient) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while registering." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const patient = await Patient.findOne({ email: email.toLowerCase().trim() });
    if (!patient) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const match = await bcrypt.compare(password, patient.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = signPatientToken(patient);
    res.json({ success: true, token, patient: toPublicPatient(patient) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while logging in." });
  }
});

router.get("/", protectAdmin, async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json({ success: true, patients: patients.map(toPublicPatient) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while fetching patients." });
  }
});

router.put("/:id", protectPatient, async (req, res) => {
  try {
    if (req.params.id !== req.patientId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to update this patient." });
    }

    const { personalInfo, medicalInfo } = req.body;
    const update = {};
    if (personalInfo) update.personalInfo = personalInfo;
    if (medicalInfo) update.medicalInfo = medicalInfo;

    const patient = await Patient.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found." });
    }

    res.json({ success: true, patient: toPublicPatient(patient) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while updating patient." });
  }
});

router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while deleting patient." });
  }
});

module.exports = router;
