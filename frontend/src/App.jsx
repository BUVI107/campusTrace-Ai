import { useState } from "react";

import { useAuth } from "./context/AuthContext";

import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import MyItemsPage from "./pages/MyItemsPage";
import MatchSuggestionPage from "./pages/MatchSuggestionPage";
import MyClaimsPage from "./pages/MyClaimsPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import TrackerPage from "./pages/TrackerPage";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ReportWizard from "./components/ReportWizard";

function App() {
    const {
        isAuthenticated,
        loading,
    } = useAuth();

    // ==========================================
    // PAGE STATE
    // ==========================================

    const [activePage, setActivePage] =
        useState("dashboard");

    // Currently selected item for AI matching
    const [selectedItemId, setSelectedItemId] =
        useState(null);

    // ==========================================
    // AUTH LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="app-loading">
                <h2>
                    Loading CampusTrace AI...
                </h2>

                <p>
                    Please wait...
                </p>
            </div>
        );
    }

    // ==========================================
    // NOT LOGGED IN
    // ==========================================

    if (!isAuthenticated) {
        return <AuthPage />;
    }

    // ==========================================
    // AUTHENTICATED APP
    // ==========================================

    return (
        <div className="app-layout">

            {/* ==================================
                NAVBAR
            ================================== */}

            <Navbar />

            <div className="app-body">

                {/* ==================================
                    SIDEBAR
                ================================== */}

                <Sidebar
                    activePage={activePage}
                    setActivePage={setActivePage}
                />

                {/* ==================================
                    MAIN CONTENT
                ================================== */}

                <div className="app-content">

                    {/* ==================================
                        DASHBOARD
                    ================================== */}

                    {activePage === "dashboard" && (
                        <DashboardPage
                            setActivePage={setActivePage}
                        />
                    )}

                    {/* ==================================
                        REPORT ITEM
                    ================================== */}

                    {activePage === "report" && (
                        <ReportWizard
                            onSuccess={() => {
                                setActivePage(
                                    "dashboard"
                                );
                            }}
                            onCancel={() => {
                                setActivePage(
                                    "dashboard"
                                );
                            }}
                        />
                    )}

                    {/* ==================================
                        MY ITEMS
                    ================================== */}

                    {activePage === "my-items" && (
                        <MyItemsPage
                            onFindMatches={(itemId) => {
                                setSelectedItemId(
                                    itemId
                                );

                                setActivePage(
                                    "matches"
                                );
                            }}
                        />
                    )}

                    {/* ==================================
                        AI MATCHES
                    ================================== */}

                    {activePage === "matches" && (
                        <MatchSuggestionPage
                            itemId={selectedItemId}
                            onBack={() => {
                                setActivePage(
                                    "my-items"
                                );
                            }}
                        />
                    )}

                    {/* ==================================
                        MY CLAIMS
                    ================================== */}

                    {activePage === "claims" && (
                        <MyClaimsPage />
                    )}

                    {/* ==================================
                        ADMIN PANEL
                    ================================== */}

                    {activePage === "admin" && (
                        <AdminPanelPage />
                    )}

                    {/* ==================================
                        TRACKER
                    ================================== */}

                    {activePage === "tracker" && (
                        <TrackerPage />
                    )}

                    {/* ==================================
                        OTHER MODULES
                    ================================== */}

                    {activePage !== "dashboard" &&
                        activePage !== "report" &&
                        activePage !== "my-items" &&
                        activePage !== "matches" &&
                        activePage !== "claims" &&
                        activePage !== "admin" &&
                        activePage !== "tracker" && (

                            <div className="coming-soon">

                                <div>
                                    🚧
                                </div>

                                <h2>
                                    {activePage
                                        .replace(
                                            "-",
                                            " "
                                        )
                                        .replace(
                                            /\b\w/g,
                                            (letter) =>
                                                letter.toUpperCase()
                                        )}
                                </h2>

                                <p>
                                    This module is coming next.
                                </p>

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        setActivePage(
                                            "dashboard"
                                        )
                                    }
                                >
                                    Back to Dashboard
                                </button>

                            </div>
                        )}

                </div>
            </div>
        </div>
    );
}

export default App;