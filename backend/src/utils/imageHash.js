const Jimp = require("jimp");

// =====================================================
// PERCEPTUAL HASH (difference hash / dHash)
// Resizes the image to a tiny 9x8 greyscale grid and
// encodes whether each pixel is brighter than its right
// neighbour as a single bit. Similar-looking photos end
// up with hashes that differ in very few bits, even after
// resizing, mild recompression, or small crops.
// =====================================================

const HASH_WIDTH = 9;
const HASH_HEIGHT = 8;

const hashImageFile = async (filePath) => {
    try {
        const image = await Jimp.read(filePath);

        image
            .resize(HASH_WIDTH, HASH_HEIGHT)
            .greyscale();

        let bits = "";

        for (let y = 0; y < HASH_HEIGHT; y++) {
            for (let x = 0; x < HASH_WIDTH - 1; x++) {
                const left = Jimp.intToRGBA(
                    image.getPixelColor(x, y)
                ).r;

                const right = Jimp.intToRGBA(
                    image.getPixelColor(x + 1, y)
                ).r;

                bits += left > right ? "1" : "0";
            }
        }

        // Store as hex for compactness
        return BigInt("0b" + bits).toString(16);
    } catch (error) {
        console.error("Image Hash Error:", error.message);
        return null;
    }
};

// =====================================================
// HAMMING DISTANCE between two hex-encoded hashes
// =====================================================

const hammingDistance = (hashA, hashB) => {
    if (!hashA || !hashB) {
        return null;
    }

    try {
        let a = BigInt("0x" + hashA);
        let b = BigInt("0x" + hashB);
        let xor = a ^ b;

        let distance = 0;

        while (xor > 0n) {
            distance += Number(xor & 1n);
            xor >>= 1n;
        }

        return distance;
    } catch (error) {
        return null;
    }
};

const TOTAL_BITS = HASH_WIDTH_TOTAL_BITS();

function HASH_WIDTH_TOTAL_BITS() {
    return (HASH_WIDTH - 1) * HASH_HEIGHT;
}

// =====================================================
// CONVERT HAMMING DISTANCE INTO A 0-1 SIMILARITY SCORE
// =====================================================

const distanceToSimilarity = (distance) => {
    if (distance === null || distance === undefined) {
        return 0;
    }

    return Math.max(0, 1 - distance / TOTAL_BITS);
};

// =====================================================
// BEST SIMILARITY ACROSS TWO SETS OF IMAGE HASHES
// An item can have multiple photos; we compare every
// pair and keep the strongest match.
// =====================================================

const bestImageSimilarity = (hashesA = [], hashesB = []) => {
    if (!hashesA.length || !hashesB.length) {
        return 0;
    }

    let best = 0;

    for (const a of hashesA) {
        for (const b of hashesB) {
            const distance = hammingDistance(a, b);
            const similarity = distanceToSimilarity(distance);

            if (similarity > best) {
                best = similarity;
            }
        }
    }

    return best;
};

module.exports = {
    hashImageFile,
    hammingDistance,
    bestImageSimilarity
};
