// middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/* Resolve __dirname (ESM safe) */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Absolute upload directory: server/uploads */
const uploadDir = path.join(__dirname, "..", "uploads");

/* Ensure uploads folder exists */
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* Storage config */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

/* File filter (CSV only) */
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext !== ".csv") {
    cb(new Error("Only CSV files are allowed"), false);
  } else {
    cb(null, true);
  }
};

/* Multer instance */
const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default uploadMiddleware;
