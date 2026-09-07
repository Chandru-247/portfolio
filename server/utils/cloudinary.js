const cloudinary = require('cloudinary').v2;

// Initialize configuration from environment variables
function initCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
    return true;
  }

  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({ secure: true });
    return true;
  }

  return false;
}

// Check if Cloudinary credentials have been provided and configure if present
function isCloudinaryConfigured() {
  const isConfigured = Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) ||
    process.env.CLOUDINARY_URL
  );
  if (isConfigured) {
    initCloudinary();
  }
  return isConfigured;
}

// Auto-initialize if environment variables are already loaded
if (isCloudinaryConfigured()) {
  initCloudinary();
}

/**
 * Upload a memory buffer (from multer or generated PDF) directly to Cloudinary.
 * @param {Buffer} buffer - Buffer containing the file data
 * @param {Object} options - Cloudinary upload options (folder, public_id, resource_type, etc.)
 * @returns {Promise<Object>} - Resolves to the Cloudinary upload result
 */
function uploadStream(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(new Error('Cloudinary is not configured. Missing API credentials.'));
    }

    initCloudinary();

    const uploadOptions = {
      folder: 'galaxy_portfolio',
      resource_type: 'auto',
      ...options
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });

    stream.end(buffer);
  });
}

/**
 * Remove an asset from Cloudinary
 * @param {string} publicId 
 * @param {string} resourceType 
 */
async function deleteAsset(publicId, resourceType = 'image') {
  if (!isCloudinaryConfigured() || !publicId) return null;
  initCloudinary();
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Failed to delete asset from Cloudinary:', err.message);
    return null;
  }
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadStream,
  deleteAsset
};
