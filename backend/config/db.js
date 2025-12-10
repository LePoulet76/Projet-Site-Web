import dotenv from "dotenv";
dotenv.config({ path: './mdp.env' });
import mysql from "mysql2/promise";


// Créer un pool de connexion
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10,
});


//Vérification de la connexion avec la BDD
async function testBDDConnection()
{
    try
    {
        const connection = await db.getConnection()
        connection.release();
        console.log("Connection réussie avec la BDD");
    }
    catch(error) 
    {
       
        console.error(" ÉCHEC FATAL DE CONNEXION BDD. ERREUR SPÉCIFIQUE :", error); 
        process.exit(1);
    }
}
testBDDConnection();

// fonction pour recup un user par son email 
export async function getUserByEmail(email)
{
    const[mail]= await db.execute('SELECT id, username, password, email FROM users WHERE email = ?',[email]);
     if (mail.length > 0) {
        // Retourne le premier résultat trouvé
        return mail[0];
    } else {
        // Retourne undefined si le tableau est vide (aucun utilisateur trouvé)
        return undefined;
    }
}
export async function getUserByPseudo(pseudo)
{
    const[user]= await db.execute('SELECT id, username, password, email FROM users WHERE username = ?',[pseudo]);
     if (user.length > 0) {
        // Retourne le premier résultat trouvé
        return user[0];
    } else {
        // Retourne undefined si le tableau est vide (aucun utilisateur trouvé)
        return undefined;
    }
}
//fonction pour créer un user dans la BDD
export async function createUser(email,hashedPassword,pseudo)
{
    const [result] = await db.execute('INSERT INTO users (email, password, username,pdp) VALUES (?, ?, ?)',[email, hashedPassword,pseudo]);
    return result.insertId;
}

export default db;