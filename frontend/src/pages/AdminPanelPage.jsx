import { useEffect, useState } from "react";

import {
    getPendingClaims,
    approveClaim,
    rejectClaim,
} from "../services/api";

function AdminPanelPage() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    // ==========================================
    // LOAD PENDING CLAIMS
    // ==========================================

    const loadClaims = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getPendingClaims();

            console.log("Pending Claims:", response);

            setClaims(response.claims || []);
        } catch (error) {
            console.error(
                "Get Pending Claims Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load pending claims."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {
        let cancelled = false;

        const fetchInitialClaims = async () => {
            try {
                const response =
                    await getPendingClaims();

                if (cancelled) {
                    return;
                }

                console.log(
                    "Pending Claims:",
                    response
                );

                setClaims(
                    response.claims || []
                );
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Get Pending Claims Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                        "Unable to load pending claims."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchInitialClaims();

        return () => {
            cancelled = true;
        };
    }, []);

    // ==========================================
    // APPROVE CLAIM
    // ==========================================

    const handleApprove = async (claimId) => {
        try {
            setActionLoading(claimId);
            setError("");

            const response =
                await approveClaim(claimId);

            console.log(
                "Approve Claim Response:",
                response
            );

            setClaims((previousClaims) =>
                previousClaims.filter(
                    (claim) =>
                        claim._id !== claimId
                )
            );

        } catch (error) {
            console.error(
                "Approve Claim Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to approve claim."
            );
        } finally {
            setActionLoading(null);
        }
    };

    // ==========================================
    // REJECT CLAIM
    // ==========================================

    const handleReject = async (claimId) => {
        const rejectionReason =
            window.prompt(
                "Enter rejection reason:"
            );

        if (!rejectionReason?.trim()) {
            return;
        }

        try {
            setActionLoading(claimId);
            setError("");

            const response =
                await rejectClaim(
                    claimId,
                    rejectionReason.trim()
                );

            console.log(
                "Reject Claim Response:",
                response
            );

            setClaims((previousClaims) =>
                previousClaims.filter(
                    (claim) =>
                        claim._id !== claimId
                )
            );

        } catch (error) {
            console.error(
                "Reject Claim Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to reject claim."
            );
        } finally {
            setActionLoading(null);
        }
    };

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
                    Loading pending claims...
                </h2>

                <p>
                    Fetching claims that need
                    admin review.
                </p>

            </div>
        );
    }

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
                        Admin Panel
                    </h1>

                    <p>
                        Review and manage pending
                        item claims.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={loadClaims}
                    disabled={
                        actionLoading !== null
                    }
                >
                    🔄 Refresh
                </button>

            </div>

            {/* ==================================
                ERROR
            ================================== */}

            {error && (
                <div
                    style={{
                        background: "#fee2e2",
                        border:
                            "1px solid #fca5a5",
                        color: "#991b1b",
                        padding: "15px 18px",
                        borderRadius: "12px",
                        marginBottom: "20px",
                    }}
                >
                    ⚠️ {error}
                </div>
            )}

            {/* ==================================
                SUMMARY
            ================================== */}

            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-icon claim">
                        🔐
                    </div>

                    <div>
                        <span>
                            Pending Claims
                        </span>

                        <strong>
                            {claims.length}
                        </strong>
                    </div>

                </div>

            </div>

            {/* ==================================
                CLAIM SECTION
            ================================== */}

            <div className="dashboard-section">

                <div className="section-heading">

                    <div>
                        <h2>
                            Claims Awaiting Review
                        </h2>

                        <p>
                            Verify ownership before
                            approving a claim.
                        </p>
                    </div>

                </div>

                {/* ==================================
                    NO PENDING CLAIMS
                ================================== */}

                {claims.length === 0 ? (

                    <div className="empty-state">

                        <div>
                            ✅
                        </div>

                        <h3>
                            No pending claims
                        </h3>

                        <p>
                            All claims have been
                            reviewed.
                        </p>

                    </div>

                ) : (

                    /* ==================================
                       CLAIM LIST
                    ================================== */

                    <div className="claims-list">

                        {claims.map((claim) => {

                            const isProcessing =
                                actionLoading ===
                                claim._id;

                            return (
                                <div
                                    className="admin-claim-card"
                                    key={claim._id}
                                >

                                    {/* ==========================
                                        CLAIM HEADER
                                    ========================== */}

                                    <div className="admin-claim-header">

                                        <div>

                                            <h3>
                                                {claim.item?.title ||
                                                    "Unknown Item"}
                                            </h3>

                                            <span>
                                                📍{" "}
                                                {claim.item?.location ||
                                                    "Location unavailable"}
                                            </span>

                                        </div>

                                        <span className="status-badge pending">
                                            Pending
                                        </span>

                                    </div>

                                    {/* ==========================
                                        CLAIMANT
                                    ========================== */}

                                    <div className="admin-claim-section">

                                        <strong>
                                            👤 Claimant
                                        </strong>

                                        <p>
                                            {claim.claimedBy?.name ||
                                                "Unknown user"}
                                        </p>

                                        <p>
                                            📧{" "}
                                            {claim.claimedBy?.email ||
                                                "No email"}
                                        </p>

                                        {claim.claimedBy
                                            ?.phone && (
                                            <p>
                                                📱{" "}
                                                {
                                                    claim
                                                        .claimedBy
                                                        .phone
                                                }
                                            </p>
                                        )}

                                        {claim.claimedBy
                                            ?.collegeId && (
                                            <p>
                                                🎓{" "}
                                                {
                                                    claim
                                                        .claimedBy
                                                        .collegeId
                                                }
                                            </p>
                                        )}

                                    </div>

                                    {/* ==========================
                                        OWNERSHIP MESSAGE
                                    ========================== */}

                                    <div className="admin-claim-message">

                                        <strong>
                                            💬 Ownership Message
                                        </strong>

                                        <p>
                                            {claim.message ||
                                                "No message provided."}
                                        </p>

                                    </div>

                                    {/* ==========================
                                        ITEM DETAILS
                                    ========================== */}

                                    <div className="admin-item-details">

                                        <span>
                                            Category:{" "}
                                            {claim.item?.category ||
                                                "N/A"}
                                        </span>

                                        <span>
                                            Color:{" "}
                                            {claim.item?.color ||
                                                "N/A"}
                                        </span>

                                        <span>
                                            Brand:{" "}
                                            {claim.item?.brand ||
                                                "N/A"}
                                        </span>

                                    </div>

                                    {/* ==========================
                                        ACTION BUTTONS
                                    ========================== */}

                                    <div className="admin-claim-actions">

                                        <button
                                            type="button"
                                            className="secondary-button reject-button"
                                            disabled={
                                                isProcessing
                                            }
                                            onClick={() =>
                                                handleReject(
                                                    claim._id
                                                )
                                            }
                                        >
                                            {isProcessing
                                                ? "Processing..."
                                                : "❌ Reject"}
                                        </button>

                                        <button
                                            type="button"
                                            className="primary-button"
                                            disabled={
                                                isProcessing
                                            }
                                            onClick={() =>
                                                handleApprove(
                                                    claim._id
                                                )
                                            }
                                        >
                                            {isProcessing
                                                ? "Processing..."
                                                : "✅ Approve"}
                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </div>
    );
}

export default AdminPanelPage;