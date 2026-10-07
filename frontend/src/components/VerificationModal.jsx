import { useState } from "react";

function VerificationModal({
    item,
    onClose,
    onSubmit,
    loading = false,
}) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit(message);
    };

    if (!item) {
        return null;
    }

    return (
        <div className="modal-overlay">

            <div className="verification-modal">

                {/* ==================================
                    HEADER
                ================================== */}

                <div className="modal-header">

                    <div>
                        <h2>
                            🔐 Verify Ownership
                        </h2>

                        <p>
                            Tell us why this item belongs
                            to you.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        disabled={loading}
                    >
                        ×
                    </button>

                </div>

                {/* ==================================
                    ITEM INFORMATION
                ================================== */}

                <div className="verification-item">

                    <div className="verification-icon">
                        📦
                    </div>

                    <div>

                        <strong>
                            {item.title}
                        </strong>

                        <p>
                            📍 {item.location}
                        </p>

                        {item.color && (
                            <p>
                                🎨 {item.color}
                            </p>
                        )}

                        {item.brand && (
                            <p>
                                🏷️ {item.brand}
                            </p>
                        )}

                    </div>

                </div>

                {/* ==================================
                    VERIFICATION FORM
                ================================== */}

                <form onSubmit={handleSubmit}>

                    <label htmlFor="ownership-message">
                        Ownership Details
                    </label>

                    <textarea
                        id="ownership-message"
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        placeholder="Describe something that proves this item belongs to you..."
                        rows={5}
                        required
                        disabled={loading}
                    />

                    <p className="verification-hint">
                        Example: Mention a unique mark,
                        sticker, ID card, keychain, or
                        other identifying detail.
                    </p>

                    {/* ==================================
                        ACTIONS
                    ================================== */}

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={
                                loading ||
                                !message.trim()
                            }
                        >
                            {loading
                                ? "Submitting..."
                                : "Submit Claim"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default VerificationModal;