import { assetUrl } from "../services/api";

// Compact, reusable presentation of one AI match, including the
// new photo-similarity and same-campus signals.

function MatchCard({ match, onClaim, claimLabel = "Claim item" }) {
    const photo = match.images?.[0];
    const d = match.details || {};

    return (
        <div className="mini-match">
            {photo ? (
                <img
                    src={assetUrl(photo)}
                    alt={match.title}
                    className="mini-match-photo"
                />
            ) : (
                <div className="mini-match-photo placeholder">📦</div>
            )}

            <div className="mini-match-body">
                <div className="mini-match-top">
                    <strong>{match.title}</strong>
                    <span className="mini-match-score">{match.matchScore}%</span>
                </div>

                <span className="mini-match-loc">
                    📍 {match.location}
                    {match.building ? ` · ${match.building}` : ""}
                </span>

                <div className="mini-match-tags">
                    {d.photoScore !== null && d.photoScore !== undefined && (
                        <span>📷 Photo {d.photoScore}%</span>
                    )}
                    {d.sameCampus && <span>🏫 Same campus</span>}
                    <span>{match.confidence} confidence</span>
                </div>

                {onClaim && (
                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => onClaim(match)}
                    >
                        {claimLabel}
                    </button>
                )}
            </div>
        </div>
    );
}

export default MatchCard;
