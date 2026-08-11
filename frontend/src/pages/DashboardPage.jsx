import { useEffect, useState } from "react";
import {
    getItems,
    getMyClaims,
    getAnalytics,
} from "../services/api";

function DashboardPage({ setActivePage }) {
    const [stats, setStats] = useState({
        lostItems: 0,
        foundItems: 0,
        aiMatches: 0,
        pendingClaims: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                itemsResponse,
                claimsResponse,
            ] = await Promise.all([
                getItems(),
                getMyClaims(),
            ]);

            const items =
                itemsResponse.items || [];

            const claims =
                claimsResponse.claims || [];

            const lostItems =
                items.filter(
                    (item) =>
                        item.type === "lost"
                ).length;

            const foundItems =
                items.filter(
                    (item) =>
                        item.type === "found"
                ).length;

            const pendingClaims =
                claims.filter(
                    (claim) =>
                        claim.status === "pending"
                ).length;

            let aiMatches = 0;

            try {
                const analytics =
                    await getAnalytics();

                aiMatches =
                    analytics?.aiMatches ||
                    analytics?.data?.aiMatches ||
                    0;
            } catch (analyticsError) {
                console.warn(
                    "Analytics unavailable:",
                    analyticsError
                );
            }

            setStats({
                lostItems,
                foundItems,
                aiMatches,
                pendingClaims,
            });
        } catch (error) {
            console.error(
                "Dashboard Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load dashboard data."
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

        const load = async () => {
            if (!cancelled) {
                await loadDashboard();
            }
        };

        load();

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
                    📊
                </div>

                <h2>
                    Loading dashboard...
                </h2>

                <p>
                    Getting your latest CampusTrace
                    activity.
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
                    Dashboard unavailable
                </h2>

                <p>
                    {error}
                </p>

                <button
                    className="primary-button"
                    onClick={loadDashboard}
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

            {/* ==================================
                HEADER
            ================================== */}

            <div className="dashboard-header">

                <div>
                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Here's what's happening
                        with CampusTrace today.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() =>
                        setActivePage("report")
                    }
                >
                    + Report Item
                </button>

            </div>

            {/* ==================================
                STAT CARDS
            ================================== */}

            <div className="stats-grid">

                {/* LOST */}

                <div className="stat-card">

                    <div className="stat-icon lost">
                        🔴
                    </div>

                    <div>
                        <span>
                            Lost Items
                        </span>

                        <strong>
                            {stats.lostItems}
                        </strong>
                    </div>

                </div>

                {/* FOUND */}

                <div className="stat-card">

                    <div className="stat-icon found">
                        🟢
                    </div>

                    <div>
                        <span>
                            Found Items
                        </span>

                        <strong>
                            {stats.foundItems}
                        </strong>
                    </div>

                </div>

                {/* AI MATCHES */}

                <div className="stat-card">

                    <div className="stat-icon matches">
                        🤖
                    </div>

                    <div>
                        <span>
                            AI Matches
                        </span>

                        <strong>
                            {stats.aiMatches}
                        </strong>
                    </div>

                </div>

                {/* CLAIMS */}

                <div className="stat-card">

                    <div className="stat-icon claims">
                        🔐
                    </div>

                    <div>
                        <span>
                            Pending Claims
                        </span>

                        <strong>
                            {stats.pendingClaims}
                        </strong>
                    </div>

                </div>

            </div>

            {/* ==================================
                QUICK ACTIONS
            ================================== */}

            <div className="dashboard-section">

                <div className="section-heading">

                    <div>
                        <h2>
                            Quick Actions
                        </h2>

                        <p>
                            Manage your lost and
                            found items.
                        </p>
                    </div>

                </div>

                <div className="quick-actions">

                    {/* REPORT LOST */}

                    <button
                        className="quick-action-card"
                        onClick={() =>
                            setActivePage("report")
                        }
                    >
                        <div className="quick-action-icon">
                            🔴
                        </div>

                        <div>
                            <strong>
                                Report Lost Item
                            </strong>

                            <span>
                                Report something you
                                lost.
                            </span>
                        </div>
                    </button>

                    {/* MY ITEMS */}

                    <button
                        className="quick-action-card"
                        onClick={() =>
                            setActivePage(
                                "my-items"
                            )
                        }
                    >
                        <div className="quick-action-icon">
                            📦
                        </div>

                        <div>
                            <strong>
                                My Items
                            </strong>

                            <span>
                                View your reported
                                items.
                            </span>
                        </div>
                    </button>

                    {/* AI MATCHES */}

                    <button
                        className="quick-action-card"
                        onClick={() =>
                            setActivePage(
                                "matches"
                            )
                        }
                    >
                        <div className="quick-action-icon">
                            🤖
                        </div>

                        <div>
                            <strong>
                                AI Matches
                            </strong>

                            <span>
                                Check potential item
                                matches.
                            </span>
                        </div>
                    </button>

                    {/* TRACKER */}

                    <button
                        className="quick-action-card"
                        onClick={() =>
                            setActivePage(
                                "tracker"
                            )
                        }
                    >
                        <div className="quick-action-icon">
                            📍
                        </div>

                        <div>
                            <strong>
                                Track Item
                            </strong>

                            <span>
                                Follow your item's
                                progress.
                            </span>
                        </div>
                    </button>

                </div>

            </div>

        </div>
    );
}

export default DashboardPage;