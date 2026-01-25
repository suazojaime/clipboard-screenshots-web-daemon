const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// 🔧 Define upload folder (predefined)
const UPLOAD_DIR = path.join(__dirname, "img");

// Ensure folder exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Auto filename generator
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `screenshot-${timestamp}${ext}`);
  }
});

const upload = multer({ storage });

// Upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    success: true,
    filename: req.file.filename,
    path: `/img/${req.file.filename}`
  });
});

app.use(express.static("."));
app.use("/img", express.static(UPLOAD_DIR));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
