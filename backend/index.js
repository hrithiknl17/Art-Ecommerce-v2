import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "art-ecommerce-products",
    });

    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Cloudinary upload server running on port 5000");
});
