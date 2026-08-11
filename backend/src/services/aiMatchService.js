const Item = require("../models/Item");

// =====================================================
// CAMPUS TRACE AI - SMART MATCHING SERVICE
// =====================================================

// Normalize text for comparison
const normalizeText = (value = "") => {
    return value
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

// Calculate word similarity between two texts
const textSimilarity = (text1 = "", text2 = "") => {
    const a = normalizeText(text1);
    const b = normalizeText(text2);

    if (!a || !b) return 0;

    if (a === b) return 1;

    const wordsA = new Set(a.split(" "));
    const wordsB = new Set(b.split(" "));

    const intersection = [...wordsA].filter(word =>
        wordsB.has(word)
    );

    const union = new Set([...wordsA, ...wordsB]);

    return intersection.length / union.size;
};

// Compare two individual values
const valueSimilarity = (value1, value2) => {
    if (!value1 || !value2) return 0;

    return normalizeText(value1) === normalizeText(value2)
        ? 1
        : 0;
};

// Calculate geographic distance using Haversine formula
const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
) => {
    if (
        lat1 === undefined ||
        lon1 === undefined ||
        lat2 === undefined ||
        lon2 === undefined
    ) {
        return null;
    }

    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c =
        2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

// Convert distance into similarity score
const locationSimilarity = (
    item1,
    item2
) => {
    const locationMatch = valueSimilarity(
        item1.location,
        item2.location
    );

    let coordinateScore = 0;

    const coordinates1 = item1.coordinates || {};
    const coordinates2 = item2.coordinates || {};

    const distance = calculateDistance(
        coordinates1.latitude,
        coordinates1.longitude,
        coordinates2.latitude,
        coordinates2.longitude
    );

    if (distance !== null) {
        if (distance <= 0.1) {
            coordinateScore = 1;
        } else if (distance <= 0.5) {
            coordinateScore = 0.9;
        } else if (distance <= 1) {
            coordinateScore = 0.7;
        } else if (distance <= 3) {
            coordinateScore = 0.4;
        } else {
            coordinateScore = 0.1;
        }
    }

    // Give more importance to exact campus location
    if (locationMatch === 1 && distance !== null) {
        return (locationMatch * 0.6) + (coordinateScore * 0.4);
    }

    return locationMatch || coordinateScore;
};

// =====================================================
// CALCULATE MATCH SCORE
// =====================================================

const calculateMatch = (lostItem, foundItem) => {

    const categoryScore = valueSimilarity(
        lostItem.category,
        foundItem.category
    );

    const colorScore = valueSimilarity(
        lostItem.color,
        foundItem.color
    );

    const brandScore = valueSimilarity(
        lostItem.brand,
        foundItem.brand
    );

    const titleScore = textSimilarity(
        lostItem.title,
        foundItem.title
    );

    const descriptionScore = textSimilarity(
        lostItem.description,
        foundItem.description
    );

    const locationScore = locationSimilarity(
        lostItem,
        foundItem
    );

    // =================================================
    // WEIGHTED AI MATCH SCORE
    // =================================================

    const score =
        categoryScore * 0.25 +
        colorScore * 0.15 +
        brandScore * 0.15 +
        titleScore * 0.15 +
        descriptionScore * 0.15 +
        locationScore * 0.15;

    const matchScore = Math.round(score * 100);

    // =================================================
    // EXPLAINABLE AI
    // =================================================

    const reasons = [];

    if (categoryScore >= 1) {
        reasons.push(
            `Same category: ${lostItem.category}`
        );
    }

    if (colorScore >= 1) {
        reasons.push(
            `Same color: ${lostItem.color}`
        );
    }

    if (brandScore >= 1) {
        reasons.push(
            `Same brand: ${lostItem.brand}`
        );
    }

    if (titleScore >= 0.5) {
        reasons.push(
            "Similar item names"
        );
    }

    if (descriptionScore >= 0.3) {
        reasons.push(
            "Similar item descriptions"
        );
    }

    if (locationScore >= 0.7) {
        reasons.push(
            "Found near the reported lost location"
        );
    }

    let confidence = "low";

    if (matchScore >= 80) {
        confidence = "high";
    } else if (matchScore >= 60) {
        confidence = "medium";
    }

    return {
        matchScore,
        confidence,
        reasons,
        details: {
            categoryScore: Math.round(categoryScore * 100),
            colorScore: Math.round(colorScore * 100),
            brandScore: Math.round(brandScore * 100),
            titleScore: Math.round(titleScore * 100),
            descriptionScore: Math.round(descriptionScore * 100),
            locationScore: Math.round(locationScore * 100)
        }
    };
};

// =====================================================
// FIND MATCHES FOR AN ITEM
// =====================================================

const findMatches = async (itemId) => {

    const item = await Item.findById(itemId);

    if (!item) {
        throw new Error("Item not found");
    }

    // Find opposite item type
    const oppositeType =
        item.type === "lost"
            ? "found"
            : "lost";

    const oppositeItems = await Item.find({
        type: oppositeType,
        status: "active",
        _id: { $ne: item._id }
    });

    const matches = [];

    for (const candidate of oppositeItems) {

        const result = calculateMatch(
            item,
            candidate
        );

        // Only return meaningful matches
        if (result.matchScore >= 40) {

            matches.push({
                itemId: candidate._id,
                type: candidate.type,
                title: candidate.title,
                description: candidate.description,
                category: candidate.category,
                color: candidate.color,
                brand: candidate.brand,
                location: candidate.location,
                matchScore: result.matchScore,
                confidence: result.confidence,
                reasons: result.reasons,
                details: result.details
            });
        }
    }

    // Highest score first
    matches.sort(
        (a, b) => b.matchScore - a.matchScore
    );

    return {
        sourceItem: {
            id: item._id,
            type: item.type,
            title: item.title
        },
        totalMatches: matches.length,
        matches
    };
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    findMatches,
    calculateMatch,
    textSimilarity,
    calculateDistance
};