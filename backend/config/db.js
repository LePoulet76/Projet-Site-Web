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
    const [result] = await db.execute('INSERT INTO users (email, password, username) VALUES (?, ?, ?)',[email, hashedPassword,pseudo]);
    return result.insertId;
}
export async function getMixOfSongs(genre, limit) {
    const [rows] = await db.execute(
        'SELECT * FROM ? LIMIT ?',
        [genre, limit]
    );
    return rows;
}

export async function createLobbie(id,nomLobby,max_joueurs,rounds,genre,playerName,password,socket)
{
    const [result] = await db.execute('INSERT INTO lobbies (id, nom_lobby, max_joueurs, nb_tours, genre, mot_de_passe) VALUES (?, ?, ?, ?, ?, ?)',[id, nomLobby, max_joueurs, rounds, genre, null]);
    const [inster] = await db.execute('INSERT INTO joueurs (lobby_id, socket_id, pseudo, est_hote, score) VALUES (?, ?, ?, ?, ?)',[id, socket, playerName, 1, 0]);
    return result.insertId;
}


export async function verifIDLobby(IDLobby,socket,pseudo) 
{
    console.log("Vérification de l'ID du lobby dans la BDD :", IDLobby);
    console.log("Socket ID du joueur :", socket);
    console.log("Pseudo du joueur :", pseudo);
    const [result] = await db.execute('SELECT id FROM lobbies WHERE id = ?',[IDLobby]);
    if(result.length > 0)
    {
        const [inster] = await db.execute('INSERT INTO joueurs (id, lobby_id, socket_id, pseudo, est_hote, score) VALUES (?, ?, ?, ?, ?, ?)',[null, IDLobby, socket, pseudo, 0, 0]);
        return true;
    }
    else
    {
        return false;
    }
}

export async function getScoreboard(lobbyId)
{
    const [rows] = await db.execute('SELECT pseudo, score FROM joueurs WHERE lobby_id = ? ORDER BY score DESC',[lobbyId]);
    return rows;
}
export default db;