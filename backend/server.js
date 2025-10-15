import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

let photos = [];

app.get("/api/photos", (req, res) => res.json(photos));

app.post("/api/photos", upload.single("photo"), (req, res) => {
  const newPhoto = {
    id: Date.now(),
    name: req.file.originalname,
    path: `/uploads/${req.file.filename}`,
  };
  photos.push(newPhoto);
  res.json(newPhoto);
});

app.listen(4000, () => console.log("✅ Backend en ligne sur http://localhost:4000"));