import dotenv from "dotenv";
dotenv.config({ path: './mdp.env' });//fichier mdp.env contient les informations de connection à la BDD
import mysql from "mysql2/promise";//sert à communiquer avec le Node.js
import levenshtein from 'fast-levenshtein';//sert à comparer la ressemblance de 2 chaines de caractère

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
    const[mail]= await db.execute('SELECT id, username, password, email, pdp, resetToken, resetExpires FROM users WHERE email = ?',[email]);
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

//fonction pour attribuer un token à l'utilisateur pour quand il veut changer de mot de passe 
export async function saveResetToken(userId,code,expires)
{
    const query = "UPDATE users SET resetToken = ?,resetExpires =? Where id = ?";
    const [result] = await db.execute(query,[code,expires,userId]);
    return result;
}
//fonction pour créer un user dans la BDD
export async function createUser(email,hashedPassword,pseudo)
{
    const [result] = await db.execute('INSERT INTO users (email, password, username) VALUES (?, ?, ?)',[email, hashedPassword,pseudo]);
    return result.insertId;
}

//fonction de création de lobby dans la BDD
export async function createLobbie(id,nomLobby,max_joueurs,rounds,genre,playerName,password,socket)
{
    const [result] = await db.execute('INSERT INTO lobbies (id, nom_lobby, max_joueurs, nb_tours, genre, mot_de_passe) VALUES (?, ?, ?, ?, ?, ?)',[id, nomLobby, max_joueurs, rounds, genre, null]);
    const [inster] = await db.execute('INSERT INTO joueurs (lobby_id, socket_id, pseudo, est_hote, score) VALUES (?, ?, ?, ?, ?)',[id, socket, playerName, 1, 0]);
    return result.insertId;
}

//fonction de vérification de l'ID du lobby dans la BDD
export async function verifIDLobby(IDLobby,socket,pseudo) 
{
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

// fonction pour récupérer le scoreboard
export async function getScoreboard(lobbyId)
{
    const [rows] = await db.execute('SELECT pseudo, score, est_hote FROM joueurs WHERE lobby_id = ? ORDER BY score DESC',[lobbyId]);
    return rows;
}

// fonction pour déconnecter un utilisateur (supprimer de la table joueurs, pas de la table users)
export async function disconnectUser(socketId)
{
    const [result] = await db.execute('DELETE FROM joueurs WHERE socket_id = ?',[socketId]);
    return result.affectedRows > 0;
}

// fonction pour récupérer la photo de profil d'un utilisateur par son pseudo (inutilisée au final ...)
export async function getPDPByPseudo(pseudo)
{

    const [pdp] = await db.execute('SELECT pdp FROM users WHERE username = ?',[pseudo]);
     if (pdp && pdp.length > 0) {
        // Retourne le premier résultat trouvé
        return pdp[0].pdp;
    } else {
        //renvoie la pdp si elle existe
        return null;
    }
}

// fonction pour récupérer une musique aléatoire selon le genre et en excluant les musiques déjà jouées (grace a une liste d'IDs)
export async function getRandomMusic(genre, excludeIds = []) {
    const tableName = genre.toLowerCase();
    let query = `SELECT * FROM ${tableName}`;
    const params = [];

    // exclusion des IDs déjà joués
    if (excludeIds.length > 0) {
        const placeholders = excludeIds.map(() => '?').join(',');
        query += ` WHERE id NOT IN (${placeholders})`;
        params.push(...excludeIds);
    }

    // On prend 1 musique au hasard
    query += ' ORDER BY RAND() LIMIT 1';

    const [rows] = await db.execute(query, params);

    if (rows.length > 0) {
        const m = rows[0];
        const baseUrl = "http://localhost:3001";
        let cleanPath = m.path.replace('public/', '').replace('content/', '/content/');
        // Correction des slashs, sinon ça plante
        if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
        cleanPath = cleanPath.replace('//', '/');
        const fullPath = `${baseUrl}${cleanPath}`;
        let reponse = m.anime || m.film || m.serie || m.titre;
        return {
            id: m.id,
            path: fullPath,// Le chemin du fichier musique
            reponse: reponse,  // Le titre a deviner
        };
    }
    return null;
    }

    // Nettoyage des chaînes pour comparaison (trouvée sur StackOverflow)
    function cleanString(str) {
    if (!str) return "";
    return str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlève accents
        .replace(/[^a-z0-9 ]/g, "") // Enlève caractères spéciaux sauf espaces
        .trim();
    }

    // Fonction de vérification de la réponse du joueur
    export async function verifAnswer(lobbyId, tentativeJoueur) {
        const [rows] = await db.execute('SELECT reponse_actuelle FROM lobbies WHERE id = ?', [lobbyId]);

        if (rows.length === 0 || !rows[0].reponse_actuelle) return false;

        const bonneReponse = cleanString(rows[0].reponse_actuelle);
        const tentative = cleanString(tentativeJoueur);

        // nom exact 
        if (tentative === bonneReponse) return true;

        // Tolérance avec Levenshtein pour les fautes de frappe (pas tres tolérant quand meme)
        if (bonneReponse.length > 3) {
            const distance = levenshtein.get(tentative, bonneReponse);
            // On autorise 1 erreur pour 5 lettres (ex: "Naruto" -> "Narotu" passe)
            const tolerance = Math.floor(bonneReponse.length / 4); 
            if (distance <= tolerance) return true;
        }

        return false;
    }

    //Fonction pour mettre à jour la réponse actuelle dans la BDD
    export async function setReponseActuelle(lobbyId, reponse) {
        await db.execute('UPDATE lobbies SET reponse_actuelle = ? WHERE id = ?', [reponse, lobbyId]
        )
    }
    //Fonction pour ajouter des points au joueur dans la BDD, bien actualiser le scoreboard après appel sinon rien d'affiché
    export async function addScore(lobbyId, pseudo, points) {
        await db.execute('UPDATE joueurs SET score = score + ? WHERE lobby_id = ? AND pseudo = ?',[points, lobbyId, pseudo]
        )
    }
    //Fonction pour vérifier si le joueur est l'hôte du lobby, pas tres utile au final, mais je prefere une double vérification car on a eu plein d'erreurs sur cette partie
     export async function verifyHote(lobbyId, socketId) {
        const [result] = await db.execute('SELECT * FROM joueurs WHERE lobby_id = ? AND socket_id = ? AND est_hote = 1',[lobbyId, socketId]);
        if(result.length > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    // Changement de l'état de la partie 
    export async function switchState(lobbyId, newState) {
        await db.execute(
            'UPDATE lobbies SET etat = ? WHERE id = ?', 
            [newState, lobbyId]
        );
    }
    // Recupération du nombre de tours et du genre du lobby
    export async function getMaxRounds(lobbyId) {
        const [rows] = await db.execute('SELECT nb_tours FROM lobbies WHERE id = ?', [lobbyId]);
        return rows[0].nb_tours;
    }
    // Recupération du genre du lobby
    export async function getGenre(lobbyId) {
        const [rows] = await db.execute('SELECT genre FROM lobbies WHERE id = ?', [lobbyId]);
        return rows[0].genre;
    }

export default db;
