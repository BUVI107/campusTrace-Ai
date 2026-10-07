import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import {
    SERVER_URL,
    getMyNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from "../services/api";

// Bell with unread badge. Loads history over REST and listens for
// live "notification" events over a token-authenticated socket.

function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [unread, setUnread] = useState(0);
    const wrapRef = useRef(null);

    const load = useCallback(async () => {
        try {
            const data = await getMyNotifications();

            setItems(data.notifications || []);
            setUnread(data.unreadCount || 0);
        } catch {
            /* non-critical */
        }
    }, []);

    useEffect(() => {
        load();

        const token = localStorage.getItem("campusTraceToken");

        if (!token) {
            return undefined;
        }

        const socket = io(SERVER_URL, { auth: { token } });

        socket.on("notification", (n) => {
            setItems((prev) => [
                { ...n, _id: n.id, read: false },
                ...prev,
            ]);
            setUnread((u) => u + 1);
        });

        return () => socket.disconnect();
    }, [load]);

    useEffect(() => {
        const close = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", close);

        return () => document.removeEventListener("mousedown", close);
    }, []);

    const handleRead = async (n) => {
        if (n.read) {
            return;
        }

        setItems((prev) =>
            prev.map((x) => (x._id === n._id ? { ...x, read: true } : x))
        );
        setUnread((u) => Math.max(0, u - 1));

        try {
            await markNotificationRead(n._id);
        } catch {
            /* ignore */
        }
    };

    const handleReadAll = async () => {
        setItems((prev) => prev.map((x) => ({ ...x, read: true })));
        setUnread(0);

        try {
            await markAllNotificationsRead();
        } catch {
            /* ignore */
        }
    };

    return (
        <div className="bell-wrap" ref={wrapRef}>
            <button
                type="button"
                className="bell-button"
                aria-label="Notifications"
                onClick={() => setOpen((o) => !o)}
            >
                🔔
                {unread > 0 && (
                    <span className="bell-badge">
                        {unread > 9 ? "9+" : unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="bell-panel">
                    <div className="bell-panel-head">
                        <strong>Notifications</strong>

                        {unread > 0 && (
                            <button type="button" onClick={handleReadAll}>
                                Mark all read
                            </button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <p className="bell-empty">You're all caught up.</p>
                    ) : (
                        <ul>
                            {items.slice(0, 15).map((n) => (
                                <li
                                    key={n._id}
                                    className={n.read ? "" : "unread"}
                                    onClick={() => handleRead(n)}
                                >
                                    <strong>{n.title}</strong>
                                    <span>{n.message}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
