// Re-export cloudConfig to avoid breaking any references with previous typo filename
const { cloudinary, storage } = require("./cloudConfig.js");

module.exports = {
    cloudinary,
    storage,
};
