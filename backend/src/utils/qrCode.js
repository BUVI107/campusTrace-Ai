const crypto = require("crypto");
const QRCode = require("qrcode");

// =====================================================
// GENERATE A RANDOM, UNGUESSABLE TOKEN
// Used both as the found-item tag token and as the
// pickup verification token.
// =====================================================

const generateToken = () => {
    return crypto.randomBytes(12).toString("hex");
};

// =====================================================
// RENDER A TOKEN AS A QR CODE DATA URL (PNG)
// Returned directly to the frontend as an <img src>,
// no file storage needed.
// =====================================================

const generateQrDataUrl = async (payload) => {
    try {
        const dataUrl = await QRCode.toDataURL(
            typeof payload === "string"
                ? payload
                : JSON.stringify(payload),
            {
                margin: 1,
                width: 320,
                color: {
                    dark: "#594545",
                    light: "#FFF8EAFF"
                }
            }
        );

        return dataUrl;
    } catch (error) {
        console.error("QR Generation Error:", error);
        return null;
    }
};

module.exports = {
    generateToken,
    generateQrDataUrl
};
