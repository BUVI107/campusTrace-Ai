import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
    const { login, register } = useAuth();

    const [mode, setMode] = useState("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        collegeId: "",
    });

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            if (mode === "register") {
                await register({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    phone: form.phone,
                    collegeId: form.collegeId,
                });

                setSuccess(
                    "Registration successful. Please login."
                );

                setMode("login");

                setForm({
                    name: "",
                    email: form.email,
                    password: "",
                    phone: "",
                    collegeId: "",
                });
            } else {
                await login({
                    email: form.email,
                    password: form.password,
                });

                setSuccess("Login successful!");
            }
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Authentication failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f4f7fb",
                padding: "20px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "430px",
                    background: "#ffffff",
                    padding: "35px",
                    borderRadius: "20px",
                    boxShadow:
                        "0 20px 50px rgba(0,0,0,0.12)",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "25px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "45px",
                            marginBottom: "10px",
                        }}
                    >
                        🎓
                    </div>

                    <h1
                        style={{
                            margin: 0,
                            color: "#172033",
                        }}
                    >
                        CampusTrace AI
                    </h1>

                    <p
                        style={{
                            color: "#64748b",
                        }}
                    >
                        Smart Campus Lost & Found
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "25px",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            setMode("login");
                            setError("");
                            setSuccess("");
                        }}
                        style={{
                            flex: 1,
                            padding: "12px",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            background:
                                mode === "login"
                                    ? "#2563eb"
                                    : "#e2e8f0",
                            color:
                                mode === "login"
                                    ? "#ffffff"
                                    : "#334155",
                            fontWeight: "bold",
                        }}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setMode("register");
                            setError("");
                            setSuccess("");
                        }}
                        style={{
                            flex: 1,
                            padding: "12px",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            background:
                                mode === "register"
                                    ? "#2563eb"
                                    : "#e2e8f0",
                            color:
                                mode === "register"
                                    ? "#ffffff"
                                    : "#334155",
                            fontWeight: "bold",
                        }}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    {mode === "register" && (
                        <>
                            <div style={{ marginBottom: "15px" }}>
                                <label>Full Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label>Phone</label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label>College ID</label>

                                <input
                                    type="text"
                                    name="collegeId"
                                    value={form.collegeId}
                                    onChange={handleChange}
                                    placeholder="Example: CT003"
                                    required
                                    style={inputStyle}
                                />
                            </div>
                        </>
                    )}

                    <div style={{ marginBottom: "15px" }}>
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@college.edu"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                            style={inputStyle}
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                padding: "10px",
                                marginBottom: "15px",
                                borderRadius: "8px",
                                background: "#fee2e2",
                                color: "#b91c1c",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            style={{
                                padding: "10px",
                                marginBottom: "15px",
                                borderRadius: "8px",
                                background: "#dcfce7",
                                color: "#15803d",
                            }}
                        >
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            border: "none",
                            borderRadius: "10px",
                            background: "#2563eb",
                            color: "#ffffff",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        {loading
                            ? "Please wait..."
                            : mode === "login"
                                ? "Login"
                                : "Create Account"}
                    </button>
                </form>

                <p
                    style={{
                        textAlign: "center",
                        color: "#64748b",
                        marginTop: "20px",
                    }}
                >
                    {mode === "login"
                        ? "Don't have an account? "
                        : "Already have an account? "}

                    <button
                        type="button"
                        onClick={() => {
                            setMode(
                                mode === "login"
                                    ? "register"
                                    : "login"
                            );

                            setError("");
                            setSuccess("");
                        }}
                        style={{
                            border: "none",
                            background: "transparent",
                            color: "#2563eb",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        {mode === "login"
                            ? "Register"
                            : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "7px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
};

export default AuthPage;