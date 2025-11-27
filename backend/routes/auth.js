import express from "express";
import db from "../config/db.js";
import bcrypt from "bcrypt";


const router = express.Router();


// Route POST /register
router.post("/register", (req, res) => {
const { email, password } = req.body;


if (!email || !password) {
return res.status(400).json({ error: "Champs manquants" });
}


db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
if (err) return res.status(500).json({ error: "Erreur serveur" });


if (result.length > 0) {
return res.status(400).json({ error: "Email déjà utilisé" });
}


const hashed = bcrypt.hashSync(password, 10);


db.query(
"INSERT INTO users (email, password) VALUES (?, ?)",
[email, hashed],
(err) => {
if (err) return res.status(500).json({ error: "Erreur serveur" });
return res.json({ message: "Compte créé" });
}
);
});
});


export default router;