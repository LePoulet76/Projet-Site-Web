// 1. Charger dotenv
import dotenv from "dotenv";
dotenv.config();


// 2. Importer mysql2
import mysql from "mysql2";


// 3. Créer un pool de connexion
const db = mysql.createPool({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
port: process.env.DB_PORT,
connectionLimit: 10,
});


// 4. Vérification de la connexion


// 5. Exportation
export default db;