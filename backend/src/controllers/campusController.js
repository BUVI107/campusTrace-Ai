const Campus = require("../models/Campus");

// ==========================================
// LIST CAMPUSES (for report/signup dropdowns)
// ==========================================

const getCampuses = async (req, res) => {
    try {
        const campuses = await Campus.find({ isActive: true }).sort({
            name: 1
        });

        return res.status(200).json({
            success: true,
            count: campuses.length,
            campuses
        });
    } catch (error) {
        console.error("Get Campuses Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching campuses"
        });
    }
};

// ==========================================
// CREATE CAMPUS (admin only)
// ==========================================

const createCampus = async (req, res) => {
    try {
        const { name, code, buildings } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "Campus name and code are required"
            });
        }

        const existing = await Campus.findOne({
            code: code.toUpperCase().trim()
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "A campus with this code already exists"
            });
        }

        const campus = await Campus.create({
            name: name.trim(),
            code: code.trim(),
            buildings: Array.isArray(buildings)
                ? buildings
                      .filter((b) => (typeof b === "string" ? b.trim() : b?.name))
                      .map((b) => ({
                          name: typeof b === "string" ? b.trim() : b.name.trim()
                      }))
                : []
        });

        return res.status(201).json({
            success: true,
            message: "Campus created successfully",
            campus
        });
    } catch (error) {
        console.error("Create Campus Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while creating campus"
        });
    }
};

// ==========================================
// ADD BUILDING TO CAMPUS (admin only)
// ==========================================

const addBuilding = async (req, res) => {
    try {
        const { campusId } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Building name is required"
            });
        }

        const campus = await Campus.findById(campusId);

        if (!campus) {
            return res.status(404).json({
                success: false,
                message: "Campus not found"
            });
        }

        campus.buildings.push({ name: name.trim() });

        await campus.save();

        return res.status(200).json({
            success: true,
            message: "Building added successfully",
            campus
        });
    } catch (error) {
        console.error("Add Building Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while adding building"
        });
    }
};

module.exports = { getCampuses, createCampus, addBuilding };
