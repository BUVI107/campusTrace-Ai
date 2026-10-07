const nodemailer = require("nodemailer");

// =====================================================
// MAIL TRANSPORT
// Configured from environment variables. If SMTP is not
// configured, mail sending is skipped (logged only) so
// the rest of the app keeps working in dev/demo mode.
// =====================================================

let transporter = null;

const getTransporter = () => {
    if (transporter) {
        return transporter;
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        return null;
    }

    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    return transporter;
};

// =====================================================
// SEND MAIL (best-effort, never throws)
// =====================================================

const sendMail = async ({ to, subject, html }) => {
    try {
        if (!to) {
            return { sent: false, reason: "No recipient email" };
        }

        const mailer = getTransporter();

        if (!mailer) {
            console.log(
                `[mailer] SMTP not configured — skipping email to ${to}: ${subject}`
            );
            return { sent: false, reason: "SMTP not configured" };
        }

        await mailer.sendMail({
            from: process.env.SMTP_FROM || "CampusTrace AI <no-reply@campustrace.ai>",
            to,
            subject,
            html
        });

        return { sent: true };
    } catch (error) {
        console.error("Email Send Error:", error.message);
        return { sent: false, reason: error.message };
    }
};

module.exports = { sendMail };
