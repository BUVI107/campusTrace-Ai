import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="navbar">
            <div className="navbar-brand">
                <span className="navbar-logo">🎓</span>

                <div>
                    <h2>CampusTrace AI</h2>
                    <span>Smart Campus Lost & Found</span>
                </div>
            </div>

            <div className="navbar-user">
                <NotificationBell />

                <div className="user-info">
                    <strong>
                        {user?.name || "Campus User"}
                    </strong>

                    <span>
                        {user?.email || ""}
                    </span>
                </div>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Navbar;