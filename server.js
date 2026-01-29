const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const https = require('https');
const http = require('http');

const app = express();

// 🔧 Define upload folder (predefined)
const UPLOAD_DIR = path.join(__dirname, "img");

// Ensure folder exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const privateKey = fs.readFileSync('certificates/CLIPPY/CLIPPY_no_password.key', 'utf8');
const certificate = fs.readFileSync('certificates/CLIPPY/CLIPPY.crt', 'utf8');
const ca = fs.readFileSync('certificates/CLIPPY/cacert.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca // Optional, only if you have a CA bundle
};

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
    path: `img/${req.file.filename}`
  });
});

app.use(express.static("."));
app.use("/img", express.static(UPLOAD_DIR));


const httpsServer = https.createServer(credentials, app);
httpsServer.listen(8443, () => {
  console.log('HTTPS server is running on https://localhost:8443');
});
const httpServer = http.createServer(app);
httpServer.listen(8080, () => {
  console.log('HTTP server is running on http://localhost:8080');
});

//app.listen(3000, () => {
 // console.log("Server running on http://localhost:3000");
//});
