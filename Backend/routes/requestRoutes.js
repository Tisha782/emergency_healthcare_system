const express = require("express");
const Request = require("../models/Request");
const { protectAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { patientId, patientName, notes, location, hospitalId, nearestHospital } = req.body;

    if (!location || location.lat === undefined || location.lng === undefined) {
      return res.status(400).json({ success: false, message: "Location is required." });
    }

    const request = await Request.create({
      patient: patientId || null,
      patientName: patientName || "Guest",
      notes: notes || "",
      location,
      hospital: hospitalId || null,
      nearestHospital: nearestHospital || "",
    });

    res.status(201).json({ success: true, request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while creating request." });
  }
});

router.get("/", protectAdmin, async (req, res) => {
  try {
    const requests = await Request.find().populate("hospital", "name address phone").sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while fetching requests." });
  }
});

router.put("/:id/resolve", protectAdmin, async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found." });
    }

    res.json({ success: true, request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while resolving request." });
  }
});

module.exports = router;
