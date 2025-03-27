import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig.js";

// Configure Multer storage for candidate photos
const candidateStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "candidates_images",
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});

// Configure Multer storage for citizenship documents
const citizenshipStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "citizenship_images",
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});

// Configure Multer storage for citizenship documents
const userProfileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "userProfile_images",
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});

// Create multer instances for different upload types
const uploadCandidate = multer({ storage: candidateStorage });
const uploadCitizenship = multer({ storage: citizenshipStorage });
const uploadUserProfile = multer({ storage: userProfileStorage });

export { uploadCandidate, uploadCitizenship, uploadUserProfile };
