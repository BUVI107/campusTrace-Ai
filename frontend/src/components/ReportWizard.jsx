import { useEffect, useState } from "react";
import { createItem, getCampuses } from "../services/api";
import PickupQR from "./PickupQR";

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
        campus: "",
        building: "",
    });

    const [campuses, setCampuses] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [reportedItem, setReportedItem] = useState(null);

    useEffect(() => {
        const loadCampuses = async () => {
            try {
                const data = await getCampuses();

                setCampuses(data.campuses || []);
            } catch {
                /* campuses are optional */
            }
        };

        loadCampuses();
    }, []);

    const selectedCampus = campuses.find((c) => c._id === formData.campus);

    const handlePhotos = (event) => {
        setPhotos(Array.from(event.target.files || []).slice(0, 4));
    };

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

            const itemData = new FormData();

            itemData.append("type", formData.type);
            itemData.append("title", formData.title.trim());
            itemData.append("description", formData.description.trim());
            itemData.append("category", formData.category);
            itemData.append("color", formData.color.trim());
            itemData.append("brand", formData.brand.trim());
            itemData.append("location", formData.location.trim());

            if (formData.campus) {
                itemData.append("campus", formData.campus);
            }

            if (formData.building) {
                itemData.append("building", formData.building);
            }

            // Optional coordinates
            if (
                formData.latitude !== "" &&
                formData.longitude !== ""
            ) {
                itemData.append("latitude", Number(formData.latitude));
                itemData.append("longitude", Number(formData.longitude));
            }

            // Optional photos (used for photo-based AI matching)
            photos.forEach((file) => itemData.append("images", file));

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
                campus: "",
                building: "",
            });

            setPhotos([]);

            // Found items get a QR tag right away - show it so it
            // can be printed before leaving the desk.
            if (response.item?.qrCodeImage) {
                setReportedItem(response.item);
            } else if (onSuccess) {
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

    if (reportedItem) {
        return (
            <div className="report-page">
                <div className="report-header">
                    <div>
                        <h1>Found item reported ✅</h1>

                        <p>
                            Print this QR tag and attach it to the item so
                            the front desk can identify it instantly.
                        </p>
                    </div>
                </div>

                <PickupQR
                    image={reportedItem.qrCodeImage}
                    title={reportedItem.title}
                    caption="CampusTrace report tag"
                    printable
                />

                <div className="form-actions">
                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => onSuccess && onSuccess(reportedItem)}
                    >
                        Done
                    </button>
                </div>
            </div>
        );
    }

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

                    {campuses.length > 0 && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Campus</label>

                                <select
                                    name="campus"
                                    value={formData.campus}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            campus: e.target.value,
                                            building: "",
                                        }))
                                    }
                                >
                                    <option value="">Select campus</option>

                                    {campuses.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Building</label>

                                <select
                                    name="building"
                                    value={formData.building}
                                    onChange={handleChange}
                                    disabled={!selectedCampus}
                                >
                                    <option value="">Select building</option>

                                    {(selectedCampus?.buildings || []).map((b) => (
                                        <option key={b._id} value={b.name}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

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

                {/* PHOTOS */}

                <div className="form-section">
                    <h2>Photos</h2>

                    <div className="form-group">
                        <label>Add up to 4 photos (optional)</label>

                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            multiple
                            onChange={handlePhotos}
                        />
                    </div>

                    {photos.length > 0 && (
                        <div className="photo-previews">
                            {photos.map((file) => (
                                <img
                                    key={file.name + file.size}
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                />
                            ))}
                        </div>
                    )}

                    <p className="location-help">
                        📷 Clear photos let our AI compare how items look, not
                        just how they're described.
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