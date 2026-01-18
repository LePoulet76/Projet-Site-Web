import express from "express";
import http, { get } from "http";
import { Server } from "socket.io";
import cors from "cors";
//import mysql from 'mysql2/promise';
import db, { getUserByEmail, createUser, getUserByPseudo, createLobbie, verifIDLobby } from './config/db.js';
import bcrypt from 'bcrypt';//pour hacher les mdp
import jwt from 'jsonwebtoken'; //pour gérer les sessions sur le site pour pouvoir rester connecté entre les pages
import { getScoreboard,disconnectUser,verifyHote,getRandomMusic,setReponseActuelle,switchState,addScore,verifAnswer,getPDPByPseudo,saveResetToken,getGenre,getMaxRounds } from './config/db.js';
import nodemailer from "nodemailer";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'emmaorain@gmail.com', // Ton email Gmail
    pass: 'oyoqilmursuksacz' // Code à 16 caractères généré par Google
  }
});
const JWT_SECRET = process.env.JWT_SECRET || "Art1307PezBel#"
const app = express();
app.use(cors());
app.use(express.json());

const dossierMusique = path.join(__dirname, 'content');
app.use('/content', express.static(dossierMusique));
app.get('/api/pdp/:username', async (req, res) => {
    const pseudo = req.params.username;
    const pdp = await getPDPByPseudo(pseudo);
    // On renvoie l'URL de la photo
    res.json({ pdp}); 
});

// Fonction pour générer un ID de lobby
function generateLobbyId() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let id = "";
    for (let i = 0; i < 4; i++) 
    {
        id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return id;
}

const lobbyId = generateLobbyId();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const activeGames = {};

const launchNextRound = async (lobbyId) => {
        const game = activeGames[lobbyId];
        
        if (!game) return;

        // On vérifie que la partie est pas finie
        if (game.currentRound >= game.maxRounds) {
            switchState(lobbyId, 'finished'); 
            const scores = await getScoreboard(lobbyId);
            io.to(lobbyId).emit("game_over", { winner: scores[0], scores });
            delete activeGames[lobbyId]; // Nettoyage mémoire
            return;
        }

        // On prend aléatoirement une musique 
        const musique = await getRandomMusic(game.genre, game.playedIds);

        // Si on a pas asser de musique en BD, ON FERME SANS CRASH !
        if (!musique) {
            io.to(lobbyId).emit("system message", { text: "Erreur : Plus de musiques disponibles !", type: "error" });
            return;
        }

        // Actualisation des variables pour gerer la partie.
        game.currentRound++;
        game.playedIds.push(musique.id);
        
        // On enregistre la réponse dans la BD pour la vérif du tchat
        await setReponseActuelle(lobbyId, musique.reponse);
  
        // On envoie a tout le monde la musique et les infos de jeux
        io.to(lobbyId).emit("new_round", {
            round: game.currentRound,
            maxRounds: game.maxRounds,
            audioUrl: musique.path,
            duration: 10 
        });

        // Timer 15s par musique
        game.timerId = setTimeout(() => {
            endRound(lobbyId, musique); 
        }, 15000); 
  };

  // Fin round
  const endRound = (lobbyId, musique) => {
      const game = activeGames[lobbyId];
      if (!game) return;

      // Pause de 3 secondes avant la suite
      setTimeout(() => {
          launchNextRound(lobbyId);
      }, 3000);
  };
// On gère les ecoutes et envois Socket.IO
io.on("connection", (socket) => {
  const broadcastScores = async (lobbyId) => {
      const scores = await getScoreboard(lobbyId);
      // io.to(lobbyId) envoie le message à tous les gens connectés dans cette room
      io.to(lobbyId).emit("scoreboard_data", { scores: scores });
  };
  // Message système chat : connexion
  socket.broadcast.emit("system message", {
    text: `Un utilisateur s'est connecté`,
    type: "connect",
  });

  // Message de tchat reçu
  socket.on("chat message", (msg) => {
    io.to(msg.lobbyId).emit("chat message", {
        pseudo: msg.pseudo,
        text: msg.text,
        isSystem: false
    });
  });

  // Message système chat : déconnexion
  socket.on("disconnect", async () => {
    const success = await disconnectUser(socket.id);
    io.to(lobbyId).emit("system message", {
      text: `Un utilisateur s'est déconnecté`,
      type: "disconnect",
  });
});

  // Récupération données lobbyCreation
  socket.on("create_lobby", async (data) => {
    const lobbyId = generateLobbyId();
    await createLobbie(lobbyId, data.nom, data.maxPlayers, data.rounds, data.genre, data.playerName, null, socket.id);
    socket.join(lobbyId);
    socket.emit("lobby_created", { lobbyId: lobbyId });
    broadcastScores(lobbyId);
  }); 
  // Verification ID lobby pour rejoindre une partie
  socket.on("join_lobby", async (data) => {
    const lobbyExists = await verifIDLobby(data.lobbyId, socket.id, data.playerName);        
        if (lobbyExists) {
          socket.join(data.lobbyId);
          socket.emit("join_success", { lobbyId: data.lobbyId });
          broadcastScores(data.lobbyId);
        } else {
        }
      })

  // Gestion de la demande de scoreboard
  socket.on("request_scoreboard", async (data) => {
    const scores = await getScoreboard(data.lobbyId);
    socket.emit("scoreboard_data", { scores: scores });
  });

  socket.on("start_game", async (data) => {
    const lobbyId = data.lobbyId;
    const isHote = await verifyHote(lobbyId, socket.id);
    if (isHote) {
        const maxRounds = await getMaxRounds(lobbyId);
        const genre = await getGenre(lobbyId);
        activeGames[lobbyId] = {
            currentRound: 0,
            maxRounds: maxRounds,
            genre: genre,
            playedIds: [],      
            status: "playing",
            timerId: null
        };

        await switchState(lobbyId, 'playing');
        io.to(lobbyId).emit("game_started", { message: "Le jeu a commencé !" });

        setTimeout(() => {
            launchNextRound(lobbyId);
        }, 3000);
    } 
  });
  
  socket.on("end_game", async (data) => {
    const lobbyId = data.lobbyId;    
    const isHote = await verifyHote(lobbyId, socket.id);
    if (isHote) {
        if (activeGames[lobbyId]) {
            clearTimeout(activeGames[lobbyId].timerId);
            delete activeGames[lobbyId];
        }
        await switchState(lobbyId, 'finished');
        io.to(lobbyId).emit("game_over", { message: "Le jeu est fini" });
    }
  });
  socket.on("guess_answer", async (data) => {
    const { lobbyId, pseudo, text } = data;

    // Verif reponse
    const estCorrect = await verifAnswer(lobbyId, text);

    if (estCorrect) {
        try {
            // Mise à jour directe SQL
            const [result] = await db.execute('UPDATE joueurs SET score = score + 10 WHERE lobby_id = ? AND pseudo = ?',[lobbyId, pseudo]);
                // ON REDONNE LE SCORE SINON PAS D'ACTUALISATION
                const scores = await getScoreboard(lobbyId);
                io.to(lobbyId).emit("scoreboard_data", { scores: scores });
        } catch (erreur) {
            console.error("sql marche pas", erreur);
        }

    }
  });
});
//vérif avec la BDD pour l'inscription
app.post('/api/register',async (req,res)=> {
  const {email,password,pseudo}=req.body;
  console.log('Tentative d\'inscription')
  //vérification de si on a rempli le mdp et l'email
  if(!email||!password||!pseudo)
  {
    return res.status(400).json({error:"L'email, le mot de passe et le pseudo sont requis."});
  }
  //vérif dans la BDD pour savoir si l'utilisateur existe déjà ou pas 
  try{
      const userExists = await getUserByEmail(email);    
      const pseudoExists = await getUserByPseudo(pseudo);
    if(userExists)
    {
      //il y a déjà un user avec cet email 
      console.log('Email déjà utilisé');
      return res.status(409).json({error : "Cet email est déjà utilisé."});
    }
    else
    {
      if(pseudoExists)
      {
        //il y a déjà un user avec cet email 
        console.log('Pseudo déjà utilisé');
        return res.status(409).json({error : "Ce pseudo est déjà utilisé."});
      }
      else
      {
        //on fait le hachage du mdp
        const sel = 10;//plus le sel est grand plus il faudra du temps pour trouver le mdp mais c'est plus long tout court aussi 
        const hashedPassword = await bcrypt.hash(password, sel);

        //on fait l'inscription 
        const userId = await createUser(email,hashedPassword,pseudo);

        //on gère la connection une fois l'user créé
        const token = jwt.sign({ id: userId, username: pseudo, email: email },JWT_SECRET)

        //on renvoie que le truc c'est bien passé
        console.log("Inscription terminée");
        return res.status(201).json({message:"Compte créer avec succès.", token : token, user : { id: userId, username: pseudo, email: email }});
      }
    }

  }
  catch(error)//si ca fonctionne pas on renvoie un message d'erreur
  {
    console.error("Erreur détaillée lors de l'inscription :", error);
    return res.status(500).json({error :"Une erreur lors de la connection à la BDD ou lors de l'inscription"});
  }
  
});
//gérer la modif du mdp
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  try{
    const user = await getUserByEmail(email);
    if(!user)
    {
      return res.status(404).json({error:"Aucun utilisateur trouvé avec cet email."});
    }
    //création du code à 4 chiffres qu'on envoie par mail
    const code = Math.floor(1000 + Math.random() * 9000).toString();//code entre 1000 et 9999 de manière aléatoire
    //date d'éxpiration du code 
    const expires = new Date(Date.now() + 3600000);
    //on enregistre le token dans la BDD
    await saveResetToken(user.id,code,expires);
    //ecriture du mail
    const mailOptions = {
      from:'emmaorain@gmail.com',
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Utilisez ce code pour réinitialiser votre mot de passe : ${code}. Ce code expirera dans 1 heure.`};
    //envoi du mail
    await transporter.sendMail(mailOptions);
    console.log('email de réinitialisation du mdp');
    return res.status(200).json({message:"Email de réinitialisation du mot de passe envoyé."});
  }
  catch(error){
    console.error("Erreur lors de la demande de réinitialisation du mot de passe :", error);
    return res.status(500).json({error:"Erreur lors de la demande de réinitialisation du mot de passe."});
  }});

app.post('/api/reset-password-code', async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé." });

    // Vérification du code et de l'expiration
    // Attention : vérifie que les noms de colonnes resetToken et resetExpires correspondent à ta BDD
    const expirationDate = new Date(user.resetExpires).getTime(); 

  if (user.resetToken !== code || Date.now() > expirationDate) {
      return res.status(400).json({ error: "Code invalide ou expiré." });
  }

    // Hachage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mise à jour en BDD (Il faudra créer cette fonction dans db.js ou faire l'update ici)
    await db.execute(
      "UPDATE users SET password = ?, resetToken = NULL, resetExpires = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    return res.status(200).json({ message: "Mot de passe modifié !" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
});
//connection 
app.post('/api/login',async (req,res) =>
{
  const {email, password} = req.body;
  if(!email || !password)
  {
    return res.status(400).json({error:"L'email et le mot de passe sont obligatoires."});
  }
  try
  {
    let user = await getUserByEmail(email);
    if(!user)
    {
      return res.status(401).json({error:"Identifiants invalides."});
    }
    const VerifPassword = await bcrypt.compare(password,user.password); // ici on vérifie le mot de passe entré avec le mdp de l'utilisateur lié à l'email entré
    if(!VerifPassword)
    {
      return res.status(401).json({error:"Identifiants invalides."});
    }
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email },JWT_SECRET)
    return  res.status(200).json({message:"Connexion réussie.", token : token, user : { id: user.id, username: user.username, email: user.email }});

  }
  catch(error)
  {
    console.error("Erreur détaillée lors de l'inscription :", error);
    return res.status(500).json({error:"Erreur lors de la connection"});
  }
}
);

const PORT = 3001;
server.listen(PORT, () =>
  console.log(`Serveur live en ligne http://localhost:${PORT}`)
);
