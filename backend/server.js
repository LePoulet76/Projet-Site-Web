import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
//import mysql from 'mysql2/promise';
import db, { getUserByEmail, createUser, getUserByPseudo, createLobbie, verifIDLobby } from './config/db.js';
import bcrypt from 'bcrypt';//pour hacher les mdp
import jwt from 'jsonwebtoken'; //pour gérer les sessions sur le site pour pouvoir rester connecté entre les pages
import { getScoreboard } from './config/db.js';
const JWT_SECRET = process.env.JWT_SECRET || "Art1307PezBel#"
const app = express();
app.use(cors());
app.use(express.json());
// Fonction pour générer un ID de lobby unique
function generateLobbyId() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let id = "";
    for (let i = 0; i < 4; i++) {
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

// On gère les événements Socket.IO
io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté :", socket.id);

  // Message système chat : connexion
  socket.broadcast.emit("system message", {
    text: `Un utilisateur s'est connecté`,
    type: "connect",
  });

  // Message de tchat reçu
  socket.on("chat message", (msg) => {
    console.log("Message reçu :", msg);
    socket.broadcast.emit("chat message", msg);
  });

  // Message système chat : déconnexion
  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté :", socket.id);
    socket.broadcast.emit("system message", {
      text: `Un utilisateur s'est déconnecté`,
      type: "disconnect",
    });
  });

  // Récupération données lobbyCreation
  socket.on("create_lobby", (data) => {
    const lobbyId = generateLobbyId();
    console.log("Données de création de lobby reçues :", data);
    createLobbie(lobbyId, data.nom, data.maxPlayers, data.rounds, data.genre, data.playerName, null, socket.id)
    console.log("Lobby créé avec l'ID :", lobbyId);
    socket.emit("lobby_created", { lobbyId: lobbyId });
  }); 
  // Verification ID lobby pour rejoindre une partie
  socket.on("join_lobby", (data) => {
    console.log("Demande de rejoindre le lobby avec l'ID :", data.lobbyId);
    
    const lobbyExists = verifIDLobby(data.lobbyId,socket.id,data.playerName)
      .then((lobbyExists) => {
        if (lobbyExists) {
          console.log("Lobby trouvé avec l'ID :", data.lobbyId);
          socket.emit("join_success", { lobbyId: data.lobbyId });
        } else {
          console.log("Aucun lobby trouvé avec l'ID :", data.lobbyId);
        }
      })
  });
  socket.on("request_scoreboard", async (data) => {
    console.log("Scoreboard demandé pour le lobby ID :", data.lobbyId);
    const scores = await getScoreboard(data.lobbyId);
    console.log("Scores récupérés :", scores);
    socket.emit("scoreboard_data", { scores: scores });
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

//conection 
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