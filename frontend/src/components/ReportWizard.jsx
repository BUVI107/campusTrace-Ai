import { useState } from "react";
import { createItem } from "../services/api";

function ReportWizard({ onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        type: "lost",
        title: "",
        description: "",
        category: "wallet",
        color: "",
        brand: "",
        location: "",
        latitude: "",
        longitude: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleTypeChange = (type) => {
        setFormData((previous) => ({
            ...previous,
            type,
        }));

        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        // ==========================================
        // BASIC VALIDATION
        // ==========================================

        if (
            !formData.title.trim() ||
            !formData.description.trim() ||
            !formData.location.trim()
        ) {
            setError(
                "Please fill in title, description and location."
            );

            return;
        }

        try {
            setLoading(true);

            const itemData = {
                type: formData.type,
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category,
                color: formData.color.trim(),
                brand: formData.brand.trim(),
                location: formData.location.trim(),
            };

            // ==========================================
            // OPTIONAL COORDINATES
            // ==========================================

            if (
                formData.latitude !== "" &&
                formData.longitude !== ""
            ) {
                itemData.latitude =
                    Number(formData.latitude);

                itemData.longitude =
                    Number(formData.longitude);
            }

            // ==========================================
            // SEND TO BACKEND
            // ==========================================

            const response = await createItem(itemData);

            console.log(
                "Item created successfully:",
                response
            );

            setSuccess(
                formData.type === "lost"
                    ? "Lost item reported successfully!"
                    : "Found item reported successfully!"
            );

            // ==========================================
            // RESET FORM
            // ==========================================

            setFormData({
                type: "lost",
                title: "",
                description: "",
                category: "wallet",
                color: "",
                brand: "",
                location: "",
                latitude: "",
                longitude: "",
            });

            // ==========================================
            // NOTIFY PARENT
            // ==========================================

            if (onSuccess) {
                onSuccess(response);
            }

        } catch (error) {
            console.error(
                "Create Item Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to report item. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="report-page">

            {/* ======================================
                HEADER
            ====================================== */}

            <div className="report-header">

                <div>
                    <h1>
                        Report an Item
                    </h1>

                    <p>
                        Report something you lost or
                        help someone find their item.
                    </p>
                </div>

                {onCancel && (
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onCancel}
                    >
                        ← Back
                    </button>
                )}

            </div>

            {/* ======================================
                FORM
            ====================================== */}

            <form
                className="report-form"
                onSubmit={handleSubmit}
            >

                {/* TYPE */}

                <div className="form-section">

                    <h2>
                        What happened?
                    </h2>

                    <div className="type-selection">

                        <button
                            type="button"
                            className={
                                formData.type === "lost"
                                    ? "type-card selected lost-type"
                                    : "type-card"
                            }
                            onClick={() =>
                                handleTypeChange("lost")
                            }
                        >
                            <span className="type-icon">
                                🔴
                            </span>

                            <strong>
                                I Lost It
                            </strong>

                            <small>
                                Report something you lost
                            </small>
                        </button>

                        <button
                            type="button"
                            className={
                                formData.type === "found"
                                    ? "type-card selected found-type"
                                    : "type-card"
                            }
                            onClick={() =>
                                handleTypeChange("found")
                            }
                        >
                            <span className="type-icon">
                                🟢
                            </span>

                            <strong>
                                I Found It
                            </strong>

                            <small>
                                Help someone find their item
                            </small>
                        </button>

                    </div>

                </div>

                {/* ITEM INFORMATION */}

                <div className="form-section">

                    <h2>
                        Item Information
                    </h2>

                    <div className="form-group">

                        <label>
                            Item Title *
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Example: Black Leather Wallet"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Description *
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the item in detail. Include unique features, contents, markings, etc."
                            rows="5"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Category *
                        </label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="wallet">
                                Wallet
                            </option>

                            <option value="phone">
                                Phone
                            </option>

                            <option value="laptop">
                                Laptop
                            </option>

                            <option value="id-card">
                                ID Card
                            </option>

                            <option value="keys">
                                Keys
                            </option>

                            <option value="bag">
                                Bag
                            </option>

                            <option value="watch">
                                Watch
                            </option>

                            <option value="earphones">
                                Earphones
                            </option>

                            <option value="documents">
                                Documents
                            </option>

                            <option value="accessories">
                                Accessories
                            </option>

                            <option value="other">
                                Other
                            </option>
                        </select>

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Color
                            </label>

                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                placeholder="Example: Black"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Brand
                            </label>

                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="Example: WildHorn"
                            />

                        </div>

                    </div>

                </div>

                {/* LOCATION */}

                <div className="form-section">

                    <h2>
                        Location
                    </h2>

                    <div className="form-group">

                        <label>
                            Location *
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Example: Main Library"
                            required
                        />

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Latitude
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                placeholder="11.0168"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Longitude
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                placeholder="76.9558"
                            />

                        </div>

                    </div>

                    <p className="location-help">
                        💡 Coordinates help our AI find
                        items reported near the same location.
                    </p>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="form-error">
                        ⚠️ {error}
                    </div>
                )}

                {/* SUCCESS */}

                {success && (
                    <div className="form-success">
                        ✅ {success}
                    </div>
                )}

                {/* SUBMIT */}

                <div className="form-actions">

                    {onCancel && (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        type="submit"
                        className="primary-button submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Submitting..."
                            : formData.type === "lost"
                                ? "Report Lost Item"
                                : "Report Found Item"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default ReportWizard;