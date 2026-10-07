const fs = require("fs");
const path = require("path");
const multer = require("multer");

// =====================================================
// UPLOAD DESTINATION
// =====================================================

const uploadDir = path.join(__dirname, "..", "..", "uploads", "items");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// =====================================================
// STORAGE CONFIG
// =====================================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        const extension = path.extname(file.originalname).toLowerCase();

        cb(null, `item-${uniqueSuffix}${extension}`);
    }
});

// =====================================================
// FILE FILTER — IMAGES ONLY
// =====================================================

const allowedTypes = /jpeg|jpg|png|webp/;

const fileFilter = (req, file, cb) => {
    const isAllowedExt = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const isAllowedMime = allowedTypes.test(file.mimetype);

    if (isAllowedExt && isAllowedMime) {
        return cb(null, true);
    }

    cb(new Error("Only JPEG, PNG or WEBP images are allowed"));
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per photo
        files: 4
    }
});

module.exports = upload;
module.exports.uploadDir = uploadDir;
