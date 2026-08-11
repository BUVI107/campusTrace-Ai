import { useAuth } from "../context/AuthContext";

function Sidebar({
    activePage,
    setActivePage,
}) {
    const { user } = useAuth();

    // ==========================================
    // MAIN MENU
    // ==========================================

    const menuItems = [
        {
            id: "dashboard",
            icon: "📊",
            label: "Dashboard",
        },
        {
            id: "report",
            icon: "📝",
            label: "Report Item",
        },
        {
            id: "my-items",
            icon: "📦",
            label: "My Items",
        },
        {
            id: "matches",
            icon: "🤖",
            label: "AI Matches",
        },
        {
            id: "claims",
            icon: "🔐",
            label: "My Claims",
        },
        {
            id: "tracker",
            icon: "📍",
            label: "Tracker",
        },
    ];

    // ==========================================
    // ADMIN MENU
    // ==========================================

    const isAdmin = user?.role === "admin";

    if (isAdmin) {
        menuItems.push({
            id: "admin",
            icon: "🛡️",
            label: "Admin Panel",
        });
    }

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <aside className="sidebar">

            <div className="sidebar-title">
                MENU
            </div>

            <nav>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={
                            activePage === item.id
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() =>
                            setActivePage(item.id)
                        }
                    >
                        <span className="sidebar-icon">
                            {item.icon}
                        </span>

                        <span>
                            {item.label}
                        </span>
                    </button>
                ))}
            </nav>

        </aside>
    );
}

export default Sidebar;