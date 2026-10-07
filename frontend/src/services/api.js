import axios from "axios";

// ==========================================
// API BASE URL
// ==========================================

export const SERVER_URL = "http://localhost:5000";
const API_BASE_URL = `${SERVER_URL}/api`;

// Turn a stored "/uploads/..." path into a full URL
export const assetUrl = (path) =>
    path ? (path.startsWith("http") ? path : `${SERVER_URL}${path}`) : "";

// ==========================================
// AXIOS INSTANCE
// ==========================================

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(
            "campusTraceToken"
        );

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(
                "campusTraceToken"
            );

            localStorage.removeItem(
                "campusTraceUser"
            );
        }

        return Promise.reject(error);
    }
);

// ==========================================
// AUTH APIs
// ==========================================

// Register
export const registerUser = async (userData) => {
    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;
};

// Login
export const loginUser = async (loginData) => {
    const response = await api.post(
        "/auth/login",
        loginData
    );

    return response.data;
};

// ==========================================
// ITEM APIs
// ==========================================

// Create Lost / Found Item
// Accepts either a plain object or a FormData (when photos are attached).
export const createItem = async (itemData) => {
    const response = await api.post(
        "/items",
        itemData,
        itemData instanceof FormData
            ? { headers: { "Content-Type": "multipart/form-data" } }
            : undefined
    );

    return response.data;
};

// Get the report-time QR tag for one of my found items
export const getItemQr = async (itemId) => {
    const response = await api.get(`/items/${itemId}/qr`);

    return response.data;
};

// Get All Items
export const getItems = async (params = {}) => {
    const response = await api.get(
        "/items",
        {
            params,
        }
    );

    return response.data;
};

// Get Single Item
export const getItemById = async (itemId) => {
    const response = await api.get(
        `/items/${itemId}`
    );

    return response.data;
};

// Get My Items
export const getMyItems = async () => {
    const response = await api.get(
        "/items/my"
    );

    return response.data;
};

// ==========================================
// AI MATCHING APIs
// ==========================================

// Get AI Matches for an Item
export const getItemMatches = async (itemId) => {
    const response = await api.get(
        `/items/${itemId}/matches`
    );

    return response.data;
};

// ==========================================
// CLAIM APIs
// ==========================================

// Create Claim
export const createClaim = async (
    itemId,
    message = ""
) => {
    const response = await api.post(
        "/claims",
        {
            itemId,
            message,
        }
    );

    return response.data;
};

// Get My Claims
export const getMyClaims = async () => {
    const response = await api.get(
        "/claims/my"
    );

    return response.data;
};

// ==========================================
// ADMIN APIs
// ==========================================

// Get Pending Claims
export const getPendingClaims = async () => {
    const response = await api.get(
        "/admin/claims/pending"
    );

    return response.data;
};

// Approve Claim
export const approveClaim = async (claimId) => {
    const response = await api.post(
        `/admin/claims/${claimId}/approve`
    );

    return response.data;
};

// Reject Claim
export const rejectClaim = async (
    claimId,
    rejectionReason
) => {
    const response = await api.post(
        `/admin/claims/${claimId}/reject`,
        {
            rejectionReason,
        }
    );

    return response.data;
};

// ==========================================
// ANALYTICS APIs
// ==========================================

// Get Analytics
export const getAnalytics = async () => {
    const response = await api.get(
        "/analytics"
    );

    return response.data;
};

// ==========================================
// CAMPUS APIs
// ==========================================

export const getCampuses = async () => {
    const response = await api.get("/campuses");

    return response.data;
};

// ==========================================
// HOTSPOT APIs
// ==========================================

export const getHotspots = async () => {
    const response = await api.get("/analytics/hotspots");

    return response.data;
};

// ==========================================
// NOTIFICATION APIs
// ==========================================

export const getMyNotifications = async () => {
    const response = await api.get("/notifications");

    return response.data;
};

export const markNotificationRead = async (id) => {
    const response = await api.post(`/notifications/${id}/read`);

    return response.data;
};

export const markAllNotificationsRead = async () => {
    const response = await api.post("/notifications/read-all");

    return response.data;
};

// ==========================================
// THANKS APIs
// ==========================================

export const sendThanks = async (claimId, message) => {
    const response = await api.post("/thanks", { claimId, message });

    return response.data;
};

export const getSentThanks = async () => {
    const response = await api.get("/thanks/sent");

    return response.data;
};

export const getReceivedThanks = async () => {
    const response = await api.get("/thanks/received");

    return response.data;
};

// ==========================================
// HEALTH CHECK
// ==========================================

// Check Backend Health
export const checkBackendHealth = async () => {
    const response = await api.get(
        "/health"
    );

    return response.data;
};

// ==========================================
// DEFAULT EXPORT
// ==========================================

export default api;