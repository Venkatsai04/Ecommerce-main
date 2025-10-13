import multer from "multer"; // ✅ import from node_modules, not './multer'

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/"); // You can change the upload folder if needed
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname); // Keep original file name
  },
});

const upload = multer({ storage });

export default upload;
