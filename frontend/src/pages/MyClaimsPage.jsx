import { useEffect, useState } from "react";
import { getMyClaims, getSentThanks } from "../services/api";
import PickupQR from "../components/PickupQR";
import ThanksModal from "../components/ThanksModal";

function MyClaimsPage() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [thankedClaims, setThankedClaims] = useState([]);
    const [thanksTarget, setThanksTarget] = useState(null);

    // ==========================================
    // LOAD MY CLAIMS
    // ==========================================

    const loadClaims = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMyClaims();

            console.log("My Claims:", response);

            setClaims(response.claims || []);

            try {
                const thanks = await getSentThanks();

                setThankedClaims(
                    (thanks.thanks || []).map((t) => String(t.claim))
                );
            } catch {
                /* thanks history is non-critical */
            }

        } catch (error) {
            console.error(
                "Get My Claims Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load your claims."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClaims();
    }, []);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="dashboard-loading">

                <div className="loading-spinner">
                    🔐
                </div>

                <h2>
                    Loading your claims...
                </h2>

                <p>
                    Fetching your claim history.
                </p>

            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (error) {
        return (
            <div className="dashboard-error">

                <div className="error-icon">
                    ⚠️
                </div>

                <h2>
                    Unable to load claims
                </h2>

                <p>
                    {error}
                </p>

                <button
                    className="primary-button"
                    onClick={loadClaims}
                >
                    Try Again
                </button>

            </div>
        );
    }

    // ==========================================
    // STATUS CLASS
    // ==========================================

    const getStatusClass = (status) => {
        switch (status) {
            case "approved":
                return "approved";

            case "rejected":
                return "rejected";

            case "pending":
            default:
                return "pending";
        }
    };

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="dashboard">

            {/* ==================================
                HEADER
            ================================== */}

            <div className="dashboard-header">

                <div>

                    <h1>
                        My Claims
                    </h1>

                    <p>
                        Track the claims you have
                        submitted.
                    </p>

                </div>

                <button
                    className="primary-button"
                    onClick={loadClaims}
                >
                    🔄 Refresh
                </button>

            </div>

            {/* ==================================
                EMPTY STATE
            ================================== */}

            {claims.length === 0 ? (

                <div className="dashboard-section">

                    <div className="empty-state">

                        <div>
                            🔐
                        </div>

                        <h3>
                            No claims yet
                        </h3>

                        <p>
                            Claims you submit for found
                            items will appear here.
                        </p>

                    </div>

                </div>

            ) : (

                /* ==================================
                   CLAIM LIST
                ================================== */

                <div className="dashboard-section">

                    <div className="section-heading">

                        <div>

                            <h2>
                                Your Claims
                            </h2>

                            <p>
                                {claims.length} claim
                                {claims.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                submitted
                            </p>

                        </div>

                    </div>

                    <div className="items-list">

                        {claims.map((claim) => (

                            <div
                                className="item-row"
                                key={claim._id}
                            >

                                {/* ==================================
                                    CLAIM ICON
                                ================================== */}

                                <div className="item-type-icon">
                                    🔐
                                </div>

                                {/* ==================================
                                    CLAIM INFORMATION
                                ================================== */}

                                <div className="item-info">

                                    <strong>
                                        {claim.item?.title ||
                                            "Claimed Item"}
                                    </strong>

                                    <span>
                                        {claim.item?.description ||
                                            "No description available"}
                                    </span>

                                    {claim.item?.location && (
                                        <span>
                                            📍{" "}
                                            {
                                                claim.item
                                                    .location
                                            }
                                        </span>
                                    )}

                                    {claim.message && (
                                        <span>
                                            💬{" "}
                                            {claim.message}
                                        </span>
                                    )}

                                </div>

                                {/* ==================================
                                    CLAIM META
                                ================================== */}

                                <div className="item-meta">

                                    <span
                                        className={`status-badge ${getStatusClass(
                                            claim.status
                                        )}`}
                                    >
                                        {claim.status ||
                                            "pending"}
                                    </span>

                                    <small>
                                        Claim
                                    </small>

                                </div>

                                {claim.status === "approved" && (
                                    <div className="claim-extras">
                                        {claim.pickupQrImage && (
                                            <PickupQR
                                                image={claim.pickupQrImage}
                                                title="Pickup QR"
                                                caption="Show this at the front desk"
                                            />
                                        )}

                                        {thankedClaims.includes(String(claim._id)) ? (
                                            <span className="thanks-sent">
                                                💛 Thanks sent
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                className="secondary-button"
                                                onClick={() =>
                                                    setThanksTarget(claim)
                                                }
                                            >
                                                💛 Thank the finder
                                            </button>
                                        )}
                                    </div>
                                )}

                            </div>

                        ))}

                    </div>

                </div>

            )}


            {thanksTarget && (
                <ThanksModal
                    claim={thanksTarget}
                    onClose={() => setThanksTarget(null)}
                    onSent={(id) =>
                        setThankedClaims((prev) => [...prev, String(id)])
                    }
                />
            )}

        </div>
    );
}

export default MyClaimsPage;