import { useEffect, useState } from "react";

import { getHotspots } from "../services/api";

// Ranked "where things go missing" view, grouped by campus.
// Lightweight bars (no map library) so it works offline and
// on any campus without needing coordinates.

function HotspotMap() {
    const [hotspots, setHotspots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getHotspots();

                setHotspots(data.hotspots || []);
            } catch (err) {
                setError(
                    err.response?.data?.message || "Could not load hotspots."
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) {
        return <p>Loading hotspots...</p>;
    }

    if (error) {
        return <p className="modal-error">{error}</p>;
    }

    if (hotspots.length === 0) {
        return (
            <div className="empty-state">
                <div>📍</div>
                <h3>No hotspots yet</h3>
                <p>Hotspots appear once items have been reported.</p>
            </div>
        );
    }

    const max = Math.max(...hotspots.map((h) => h.total));

    const byCampus = hotspots.reduce((acc, h) => {
        (acc[h.campus] = acc[h.campus] || []).push(h);
        return acc;
    }, {});

    return (
        <div className="hotspot-wrap">
            {Object.entries(byCampus).map(([campus, spots]) => (
                <section key={campus} className="hotspot-campus">
                    <h3>{campus}</h3>

                    {spots.map((s) => (
                        <div key={s.location} className="hotspot-row">
                            <div className="hotspot-label">
                                <strong>{s.location}</strong>
                                <span>
                                    {s.lost} lost · {s.found} found
                                </span>
                            </div>

                            <div className="hotspot-bar">
                                <i style={{ width: `${(s.total / max) * 100}%` }} />
                            </div>

                            <span className="hotspot-count">{s.total}</span>
                        </div>
                    ))}
                </section>
            ))}
        </div>
    );
}

export default HotspotMap;
