import { useEffect, useState } from "react";
import { getMyItems } from "../services/api";

function MyItemsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // FETCH MY ITEMS
    // ==========================================

    const loadMyItems = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMyItems();

            console.log("My Items:", response);

            setItems(response.items || []);

        } catch (error) {
            console.error(
                "Get My Items Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load your items."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMyItems();
    }, []);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner">
                    🔄
                </div>

                <h2>
                    Loading your items...
                </h2>

                <p>
                    Fetching your lost and found reports.
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
                    Something went wrong
                </h2>

                <p>
                    {error}
                </p>

                <button
                    className="primary-button"
                    onClick={loadMyItems}
                >
                    Try Again
                </button>
            </div>
        );
    }

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="dashboard">

            {/* HEADER */}

            <div className="dashboard-header">

                <div>
                    <h1>
                        My Items
                    </h1>

                    <p>
                        Manage the items you have reported.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={loadMyItems}
                >
                    🔄 Refresh
                </button>

            </div>

            {/* EMPTY STATE */}

            {items.length === 0 ? (
                <div className="dashboard-section">

                    <div className="empty-state">

                        <div>
                            📦
                        </div>

                        <h3>
                            No items reported yet
                        </h3>

                        <p>
                            Items you report will appear here.
                        </p>

                    </div>

                </div>
            ) : (

                /* ITEMS */

                <div className="dashboard-section">

                    <div className="section-heading">

                        <div>
                            <h2>
                                Your Reports
                            </h2>

                            <p>
                                {items.length} item
                                {items.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                reported
                            </p>
                        </div>

                    </div>

                    <div className="items-list">

                        {items.map((item) => (

                            <div
                                className="item-row"
                                key={item._id}
                            >

                                {/* ICON */}

                                <div className="item-type-icon">

                                    {item.type === "lost"
                                        ? "🔴"
                                        : "🟢"}

                                </div>

                                {/* INFORMATION */}

                                <div className="item-info">

                                    <strong>
                                        {item.title}
                                    </strong>

                                    <span>
                                        {item.description}
                                    </span>

                                    <span>
                                        📍 {item.location}
                                    </span>

                                </div>

                                {/* META */}

                                <div className="item-meta">

                                    <span
                                        className={`status-badge ${item.status}`}
                                    >
                                        {item.status}
                                    </span>

                                    <small>
                                        {item.type === "lost"
                                            ? "Lost"
                                            : "Found"}
                                    </small>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>
            )}

        </div>
    );
}

export default MyItemsPage;