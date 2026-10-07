import { useState } from "react";

import { sendThanks } from "../services/api";

// Reward-free thank-you note from the owner to the finder.

function ThanksModal({ claim, onClose, onSent }) {
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const finderName = claim?.item?.reportedBy?.name || "the finder";

    const handleSubmit = async () => {
        if (!message.trim()) {
            setError("Please write a short message.");
            return;
        }

        try {
            setSending(true);
            setError("");

            await sendThanks(claim._id, message.trim());

            onSent?.(claim._id);
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not send your thanks."
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h3>💛 Thank {finderName}</h3>

                <p className="modal-sub">
                    Say thanks for returning "{claim?.item?.title}". It's free —
                    just a kind word.
                </p>

                <textarea
                    rows={4}
                    maxLength={500}
                    value={message}
                    placeholder="Thank you so much for handing it in!"
                    onChange={(e) => setMessage(e.target.value)}
                />

                {error && <p className="modal-error">{error}</p>}

                <div className="modal-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onClose}
                        disabled={sending}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={handleSubmit}
                        disabled={sending}
                    >
                        {sending ? "Sending..." : "Send thanks"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ThanksModal;
