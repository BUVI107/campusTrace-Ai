# CampusTrace AI

AI-powered campus lost & found: report items, get ranked matches, verify pickup with QR.

## Run

```bash
# backend
cd backend && cp .env.example .env   # fill MONGODB_URI and JWT_SECRET
npm install && npm run dev            # http://localhost:5000

# frontend
cd frontend && npm install && npm run dev   # http://localhost:5173
```

## v1.1 features

| Feature | Where |
|---|---|
| **Photo-based matching** – up to 4 photos per report; perceptual hashes (dHash via `jimp`) are compared and weighted 25% of the score when both items have photos | `utils/imageHash.js`, `services/aiMatchService.js`, ReportWizard |
| **Push + email notifications** – Socket.IO live push (JWT-authenticated rooms) + persisted history + nodemailer email. Fired on match found, new claim, approval, rejection, thanks | `services/notificationService.js`, `config/socket.js`, `NotificationBell` |
| **Multi-campus / building** – `Campus` model, campus/building pickers on the report form, same-campus boost (+5) and cross-campus penalty (−15) in matching, hotspots grouped by campus | `models/Campus.js`, `routes/campusRoutes.js`, `HotspotMap` |
| **Thank the finder** – free thank-you note from claimant to finder after an approved claim (one per claim) | `controllers/thanksController.js`, `ThanksModal`, My Claims |
| **QR at report time** – found items get a printable QR tag immediately; approved claims also get a pickup QR | `utils/qrCode.js`, ReportWizard, My Claims |

Also fixed: admin and analytics routes now enforce the admin role server-side (previously any logged-in user could call them).

## Setup notes

- **Email** is optional. Leave `SMTP_*` empty and email is skipped (logged only); in-app + live notifications still work.
- **Campuses**: create them with the seed script, or `POST /api/campuses` as an admin:
  ```bash
  cd backend && node scripts/seedCampus.js "Main Campus" MAIN "Library,Canteen,Block A"
  ```
  The campus picker only appears on the report form once at least one campus exists.
- Uploaded photos are stored in `backend/uploads/` (git-ignored) and served at `/uploads/...`.
- The frontend expects the API at `http://localhost:5000` (`frontend/src/services/api.js`).
