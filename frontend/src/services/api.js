import axios from "axios";

// ==========================================
// API BASE URL
// ==========================================

const API_BASE_URL = "http://localhost:5000/api";

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
export const createItem = async (itemData) => {
    const response = await api.post(
        "/items",
        itemData
    );

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