const express = require("express");
const Hospital = require("../models/Hospital");
const Bed = require("../models/Bed");
const { protectAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ name: 1 });
    res.json({ success: true, hospitals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while fetching hospitals." });
  }
});

router.put("/:id", protectAdmin, async (req, res) => {
  try {
    const { availableBeds } = req.body;

    if (availableBeds === undefined || availableBeds === null || Number(availableBeds) < 0) {
      return res
        .status(400)
        .json({ success: false, message: "A valid availableBeds value is required." });
    }

    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital not found." });
    }

    hospital.availableBeds = Math.min(Number(availableBeds), hospital.totalBeds);
    await hospital.save();

    const beds = await Bed.find({ hospital: hospital._id }).sort({ bedNumber: 1 });
    const updates = beds.map((bed, index) =>
      Bed.updateOne(
        { _id: bed._id },
        { status: index < hospital.availableBeds ? "Available" : "Occupied" }
      )
    );
    await Promise.all(updates);

    res.json({ success: true, hospital });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while updating hospital." });
  }
});
router.get("/:id/beds", protectAdmin, async (req, res) => {
  try {
    const beds = await Bed.find({ hospital: req.params.id }).sort({ bedNumber: 1 });
    res.json({ success: true, beds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while fetching beds." });
  }
});

module.exports = router;
