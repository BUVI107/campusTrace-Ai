// Displays a QR code image (a data URL produced by the backend).
// Used for both the report-time tag on found items and the
// pickup-verification code on approved claims.

function PickupQR({ image, title, caption, printable = false }) {
    if (!image) {
        return null;
    }

    const handlePrint = () => {
        const win = window.open("", "_blank", "width=420,height=560");

        if (!win) {
            return;
        }

        win.document.write(
            `<html><head><title>${title || "QR Tag"}</title></head>
             <body style="font-family:sans-serif;text-align:center;padding:24px">
             <h3>${title || "CampusTrace QR Tag"}</h3>
             <img src="${image}" style="width:260px;height:260px" />
             <p style="color:#555">${caption || ""}</p>
             <script>window.onload=()=>window.print()</script>
             </body></html>`
        );

        win.document.close();
    };

    return (
        <div className="qr-card">
            <img src={image} alt={title || "QR code"} className="qr-image" />

            {title && <strong>{title}</strong>}

            {caption && <span className="qr-caption">{caption}</span>}

            {printable && (
                <button
                    type="button"
                    className="secondary-button"
                    onClick={handlePrint}
                >
                    🖨️ Print tag
                </button>
            )}
        </div>
    );
}

export default PickupQR;
