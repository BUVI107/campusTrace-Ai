import { useEffect, useState } from "react";
import { getMyItems, getMyClaims } from "../services/api";

function TrackerPage() {
    const [items, setItems] = useState([]);
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // LOAD TRACKING DATA
    // ==========================================

    useEffect(() => {
        let cancelled = false;

        const loadTrackerData = async () => {
            try {
                const [itemsResponse, claimsResponse] =
                    await Promise.all([
                        getMyItems(),
                        getMyClaims(),
                    ]);

                if (cancelled) {
                    return;
                }

                setItems(
                    itemsResponse.items || []
                );

                setClaims(
                    claimsResponse.claims || []
                );
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Tracker Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                        "Unable to load tracking information."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadTrackerData();

        return () => {
            cancelled = true;
        };
    }, []);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner">
                    📍
                </div>

                <h2>
                    Loading tracker...
                </h2>

                <p>
                    Checking your item and claim status.
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
                    Unable to load tracker
                </h2>

                <p>
                    {error}
                </p>

                <button
                    className="primary-button"
                    onClick={() =>
                        window.location.reload()
                    }
                >
                    Try Again
                </button>
            </div>
        );
    }

    // ==========================================
    // GET CLAIM FOR ITEM
    // ==========================================

    const getItemClaim = (itemId) => {
        return claims.find(
            (claim) => {
                const claimItemId =
                    claim.item?._id ||
                    claim.item?.id ||
                    claim.item;

                return (
                    String(claimItemId) ===
                    String(itemId)
                );
            }
        );
    };

    // ==========================================
    // CALCULATE STATUS
    // ==========================================

    const getTrackerStatus = (
        item,
        claim
    ) => {
        if (
            item.status === "matched" ||
            claim?.status === "approved"
        ) {
            return {
                key: "matched",
                label: "Matched",
                icon: "🎉",
            };
        }

        if (claim?.status === "rejected") {
            return {
                key: "rejected",
                label: "Claim Rejected",
                icon: "❌",
            };
        }

        if (claim?.status === "pending") {
            return {
                key: "pending",
                label: "Under Review",
                icon: "⏳",
            };
        }

        return {
            key: "reported",
            label: "Reported",
            icon: "📦",
        };
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
                        Tracker
                    </h1>

                    <p>
                        Track the progress of your
                        lost and found items.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() =>
                        window.location.reload()
                    }
                >
                    🔄 Refresh
                </button>

            </div>

            {/* ==================================
                EMPTY STATE
            ================================== */}

            {items.length === 0 ? (

                <div className="dashboard-section">

                    <div className="empty-state">

                        <div>
                            📍
                        </div>

                        <h3>
                            Nothing to track yet
                        </h3>

                        <p>
                            Report a lost or found
                            item to start tracking it.
                        </p>

                    </div>

                </div>

            ) : (

                /* ==================================
                    TRACKING ITEMS
                ================================== */

                <div className="tracker-list">

                    {items.map((item) => {

                        const claim =
                            getItemClaim(
                                item._id
                            );

                        const tracker =
                            getTrackerStatus(
                                item,
                                claim
                            );

                        const isMatched =
                            tracker.key ===
                            "matched";

                        const isRejected =
                            tracker.key ===
                            "rejected";

                        const isPending =
                            tracker.key ===
                            "pending";

                        return (
                            <div
                                className="dashboard-section"
                                key={item._id}
                            >

                                {/* ==========================
                                    ITEM HEADER
                                ========================== */}

                                <div className="section-heading">

                                    <div>

                                        <h2>
                                            {item.title}
                                        </h2>

                                        <p>
                                            {item.type ===
                                            "lost"
                                                ? "Lost Item"
                                                : "Found Item"}
                                            {" • "}
                                            {item.location}
                                        </p>

                                    </div>

                                    <div>
                                        <span
                                            className={`status-badge ${tracker.key}`}
                                        >
                                            {tracker.icon}{" "}
                                            {tracker.label}
                                        </span>
                                    </div>

                                </div>

                                {/* ==========================
                                    TIMELINE
                                ========================== */}

                                <div className="tracker-timeline">

                                    {/* REPORTED */}

                                    <div className="tracker-step completed">

                                        <div className="tracker-dot">
                                            📦
                                        </div>

                                        <div>
                                            <strong>
                                                Item Reported
                                            </strong>

                                            <p>
                                                Your item has
                                                been added to
                                                CampusTrace.
                                            </p>
                                        </div>

                                    </div>

                                    {/* AI MATCH */}

                                    <div
                                        className={
                                            isPending ||
                                            isMatched
                                                ? "tracker-step completed"
                                                : "tracker-step"
                                        }
                                    >

                                        <div className="tracker-dot">
                                            🤖
                                        </div>

                                        <div>
                                            <strong>
                                                AI Matching
                                            </strong>

                                            <p>
                                                CampusTrace AI
                                                searches for
                                                potential matches.
                                            </p>
                                        </div>

                                    </div>

                                    {/* CLAIM */}

                                    <div
                                        className={
                                            isPending ||
                                            isMatched ||
                                            isRejected
                                                ? "tracker-step completed"
                                                : "tracker-step"
                                        }
                                    >

                                        <div className="tracker-dot">
                                            🔐
                                        </div>

                                        <div>
                                            <strong>
                                                Claim Submitted
                                            </strong>

                                            <p>
                                                {claim
                                                    ? "A claim has been submitted for this item."
                                                    : "No claim has been submitted yet."}
                                            </p>
                                        </div>

                                    </div>

                                    {/* ADMIN REVIEW */}

                                    <div
                                        className={
                                            isPending ||
                                            isMatched ||
                                            isRejected
                                                ? "tracker-step completed"
                                                : "tracker-step"
                                        }
                                    >

                                        <div className="tracker-dot">
                                            🛡️
                                        </div>

                                        <div>
                                            <strong>
                                                Admin Review
                                            </strong>

                                            <p>
                                                {isPending
                                                    ? "Your claim is currently being reviewed."
                                                    : isMatched
                                                    ? "The claim was approved by an administrator."
                                                    : isRejected
                                                    ? "The claim was rejected by an administrator."
                                                    : "Waiting for a claim to be submitted."}
                                            </p>
                                        </div>

                                    </div>

                                    {/* FINAL STATUS */}

                                    <div
                                        className={
                                            isMatched
                                                ? "tracker-step completed final"
                                                : isRejected
                                                ? "tracker-step rejected final"
                                                : "tracker-step final"
                                        }
                                    >

                                        <div className="tracker-dot">
                                            {isMatched
                                                ? "🎉"
                                                : isRejected
                                                ? "❌"
                                                : "🏁"}
                                        </div>

                                        <div>
                                            <strong>
                                                {isMatched
                                                    ? "Item Matched"
                                                    : isRejected
                                                    ? "Claim Rejected"
                                                    : "Completion"}
                                            </strong>

                                            <p>
                                                {isMatched
                                                    ? "The item has been successfully matched."
                                                    : isRejected
                                                    ? "You can review the claim and try again if appropriate."
                                                    : "This step will update after the claim process."}
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                {/* ==========================
                                    CLAIM INFORMATION
                                ========================== */}

                                {claim && (
                                    <div className="tracker-claim">

                                        <h3>
                                            Claim Information
                                        </h3>

                                        <p>
                                            <strong>
                                                Status:
                                            </strong>{" "}
                                            {claim.status}
                                        </p>

                                        {claim.message && (
                                            <p>
                                                <strong>
                                                    Message:
                                                </strong>{" "}
                                                {claim.message}
                                            </p>
                                        )}

                                    </div>
                                )}

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}

export default TrackerPage;