// Usage: node scripts/seedCampus.js "Main Campus" MAIN "Library,Canteen,Block A,Sports Complex"
require("dotenv").config();
const mongoose = require("mongoose");
const Campus = require("../src/models/Campus");

(async () => {
    const [name, code, buildings = ""] = process.argv.slice(2);

    if (!name || !code) {
        console.log('Usage: node scripts/seedCampus.js "<name>" <CODE> "<building1,building2>"');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const campus = await Campus.findOneAndUpdate(
        { code: code.toUpperCase() },
        {
            name,
            code: code.toUpperCase(),
            buildings: buildings.split(",").map((b) => b.trim()).filter(Boolean).map((b) => ({ name: b })),
            isActive: true
        },
        { upsert: true, new: true }
    );

    console.log(`Campus ready: ${campus.name} (${campus.code}) with ${campus.buildings.length} buildings`);
    process.exit(0);
})();
