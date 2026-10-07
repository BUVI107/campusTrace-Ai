import { useEffect, useState } from "react";
import {
    getItemMatches,
    createClaim,
    assetUrl,
} from "../services/api";

import VerificationModal from "../components/VerificationModal";

function MatchSuggestionPage({
    itemId,
    onBack,
}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // CLAIM STATE
    // ==========================================

    const [selectedMatch, setSelectedMatch] =
        useState(null);

    const [claimLoading, setClaimLoading] =
        useState(false);

    const [claimError, setClaimError] =
        useState("");

    const [claimSuccess, setClaimSuccess] =
        useState("");

    // ==========================================
    // LOAD AI MATCHES
    // ==========================================

    const loadMatches = async () => {
        if (!itemId) {
            setError("No item selected.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response =
                await getItemMatches(itemId);

            console.log(
                "AI Match Response:",
                response
            );

            setData(response);

        } catch (error) {
            console.error(
                "AI Match Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load AI matches."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMatches();
    }, [itemId]);

    // ==========================================
    // OPEN CLAIM MODAL
    // ==========================================

    const handleClaimClick = (match) => {
        setSelectedMatch(match);
        setClaimError("");
        setClaimSuccess("");
    };

    // ==========================================
    // CLOSE CLAIM MODAL
    // ==========================================

    const handleCloseModal = () => {
        if (claimLoading) {
            return;
        }

        setSelectedMatch(null);
        setClaimError("");
    };

    // ==========================================
    // SUBMIT CLAIM
    // ==========================================

    const handleSubmitClaim = async (message) => {
        if (!selectedMatch) {
            return;
        }

        try {
            setClaimLoading(true);
            setClaimError("");
            setClaimSuccess("");

            const response = await createClaim(
                selectedMatch.itemId,
                message
            );

            console.log(
                "Claim Response:",
                response
            );

            setClaimSuccess(
                response.message ||
                "Claim submitted successfully."
            );

            // Close modal after successful submission
            setSelectedMatch(null);

        } catch (error) {
            console.error(
                "Create Claim Error:",
                error
            );

            setClaimError(
                error.response?.data?.message ||
                "Unable to submit your claim."
            );

        } finally {
            setClaimLoading(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="dashboard-loading">

                <div className="loading-spinner">
                    🤖
                </div>

                <h2>
                    AI is finding matches...
                </h2>

                <p>
                    Comparing your item with reported
                    lost and found items.
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
                    Unable to load matches
                </h2>

                <p>
                    {error}
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                    }}
                >

                    <button
                        className="secondary-button"
                        onClick={onBack}
                    >
                        ← Back
                    </button>

                    <button
                        className="primary-button"
                        onClick={loadMatches}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    const matches = data?.matches || [];

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

                    <button
                        className="secondary-button"
                        onClick={onBack}
                        style={{
                            marginBottom: "15px",
                        }}
                    >
                        ← Back
                    </button>

                    <h1>
                        🤖 AI Matches
                    </h1>

                    <p>
                        AI-powered matches for{" "}
                        <strong>
                            {data?.sourceItem?.title ||
                                "your item"}
                        </strong>
                    </p>

                </div>

                <button
                    className="primary-button"
                    onClick={loadMatches}
                >
                    🔄 Refresh
                </button>

            </div>

            {/* ==================================
                CLAIM SUCCESS MESSAGE
            ================================== */}

            {claimSuccess && (
                <div
                    style={{
                        background: "#dcfce7",
                        border: "1px solid #86efac",
                        color: "#166534",
                        padding: "15px 18px",
                        borderRadius: "12px",
                        marginBottom: "20px",
                    }}
                >
                    ✅ {claimSuccess}
                </div>
            )}

            {/* ==================================
                CLAIM ERROR
            ================================== */}

            {claimError && (
                <div
                    style={{
                        background: "#fee2e2",
                        border: "1px solid #fca5a5",
                        color: "#991b1b",
                        padding: "15px 18px",
                        borderRadius: "12px",
                        marginBottom: "20px",
                    }}
                >
                    ⚠️ {claimError}
                </div>
            )}

            {/* ==================================
                MATCH SECTION
            ================================== */}

            <div className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Potential Matches
                        </h2>

                        <p>
                            {matches.length} match
                            {matches.length !== 1
                                ? "es"
                                : ""}{" "}
                            found by AI
                        </p>

                    </div>

                    <div
                        style={{
                            fontSize: "30px",
                        }}
                    >
                        🧠
                    </div>

                </div>

                {/* ==================================
                    NO MATCHES
                ================================== */}

                {matches.length === 0 ? (

                    <div className="empty-state">

                        <div>
                            🔍
                        </div>

                        <h3>
                            No matches found
                        </h3>

                        <p>
                            The AI could not find a
                            strong match yet.
                        </p>

                        <small>
                            New reports may create a
                            match later.
                        </small>

                    </div>

                ) : (

                    /* ==================================
                       MATCH CARDS
                    ================================== */

                    <div className="match-list">

                        {matches.map((match) => (

                            <div
                                className="match-card"
                                key={match.itemId}
                            >

                                {/* ==================================
                                    SCORE
                                ================================== */}

                                <div className="match-score">

                                    <div
                                        className={`score-circle ${
                                            match.matchScore >= 80
                                                ? "high"
                                                : match.matchScore >= 60
                                                    ? "medium"
                                                    : "low"
                                        }`}
                                    >
                                        {match.matchScore}%
                                    </div>

                                    <span>
                                        Match Score
                                    </span>

                                </div>

                                {/* ==================================
                                    CONTENT
                                ================================== */}

                                <div className="match-content">

                                    <div className="match-title-row">

                                        <div>

                                            <h3>
                                                {match.title}
                                            </h3>

                                            <span
                                                className={`confidence-badge ${match.confidence}`}
                                            >
                                                {match.confidence}
                                                {" "}
                                                confidence
                                            </span>

                                        </div>

                                        <span
                                            className={
                                                match.type ===
                                                "found"
                                                    ? "match-type found"
                                                    : "match-type lost"
                                            }
                                        >
                                            {match.type ===
                                            "found"
                                                ? "🟢 Found"
                                                : "🔴 Lost"}
                                        </span>

                                    </div>

                                    {/* DESCRIPTION */}

                                    <p className="match-description">
                                        {match.description}
                                    </p>

                                    {/* ITEM INFO */}

                                    <div className="match-info">

                                        <span>
                                            📦{" "}
                                            {match.category}
                                        </span>

                                        {match.color && (
                                            <span>
                                                🎨{" "}
                                                {match.color}
                                            </span>
                                        )}

                                        {match.brand && (
                                            <span>
                                                🏷️{" "}
                                                {match.brand}
                                            </span>
                                        )}

                                        <span>
                                            📍{" "}
                                            {match.location}
                                        </span>

                                    </div>

                                    {/* ==================================
                                        WHY IT MATCHED
                                    ================================== */}

                                    {match.reasons?.length >
                                        0 && (

                                        <div className="match-reasons">

                                            <strong>
                                                Why AI thinks
                                                this matches
                                            </strong>

                                            <ul>

                                                {match.reasons.map(
                                                    (
                                                        reason,
                                                        index
                                                    ) => (
                                                        <li
                                                            key={
                                                                index
                                                            }
                                                        >
                                                            ✅{" "}
                                                            {
                                                                reason
                                                            }
                                                        </li>
                                                    )
                                                )}

                                            </ul>

                                        </div>

                                    )}

                                    {/* ==================================
                                        MATCH DETAILS
                                    ================================== */}

                                    {match.details && (

                                        <div className="match-details">

                                            <span>
                                                Category:{" "}
                                                {
                                                    match.details
                                                        .categoryScore
                                                }%
                                            </span>

                                            <span>
                                                Color:{" "}
                                                {
                                                    match.details
                                                        .colorScore
                                                }%
                                            </span>

                                            <span>
                                                Brand:{" "}
                                                {
                                                    match.details
                                                        .brandScore
                                                }%
                                            </span>

                                            <span>
                                                Title:{" "}
                                                {
                                                    match.details
                                                        .titleScore
                                                }%
                                            </span>

                                            <span>
                                                Description:{" "}
                                                {
                                                    match.details
                                                        .descriptionScore
                                                }%
                                            </span>

                                            <span>
                                                Location:{" "}
                                                {
                                                    match.details
                                                        .locationScore
                                                }%
                                            </span>

                                            {match.details.photoScore !== null &&
                                                match.details.photoScore !== undefined && (
                                                <span>
                                                    📷 Photo:{" "}
                                                    {match.details.photoScore}%
                                                </span>
                                            )}

                                            {match.details.sameCampus && (
                                                <span>🏫 Same campus</span>
                                            )}

                                        </div>

                                    )}

                                    {match.images?.length > 0 && (
                                        <img
                                            src={assetUrl(match.images[0])}
                                            alt={match.title}
                                            className="match-photo"
                                        />
                                    )}

                                    {/* ==================================
                                        CLAIM BUTTON
                                    ================================== */}

                                    {match.type ===
                                        "found" && (
                                        <div
                                            style={{
                                                marginTop:
                                                    "20px",
                                            }}
                                        >

                                            <button
                                                type="button"
                                                className="primary-button"
                                                onClick={() =>
                                                    handleClaimClick(
                                                        match
                                                    )
                                                }
                                            >
                                                🔐 Claim This Item
                                            </button>

                                        </div>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

            {/* ==================================
                VERIFICATION MODAL
            ================================== */}

            {selectedMatch && (
                <VerificationModal
                    item={selectedMatch}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitClaim}
                    loading={claimLoading}
                />
            )}

        </div>
    );
}

export default MatchSuggestionPage;