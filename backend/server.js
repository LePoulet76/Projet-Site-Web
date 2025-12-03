import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
//import mysql from 'mysql2/promise';
import db, { getUserByEmail, createUser, getUserByPseudo } from './config/db.js';
import bcrypt from 'bcrypt';//pour hacher les mdp
const app = express();
app.use(cors());
app.use(express.json());

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

  // Message système : connexion
  socket.broadcast.emit("system message", {
    text: `Un utilisateur s'est connecté`,
    type: "connect",
  });

  // Message de chat reçu
  socket.on("chat message", (msg) => {
    console.log("Message reçu :", msg);
    io.emit("chat message", msg);
  });

  // Déconnexion
  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté :", socket.id);
    socket.broadcast.emit("system message", {
      text: `Un utilisateur s'est déconnecté`,
      type: "disconnect",
    });
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
        
        //on renvoie que le truc c'est bien passé
        console.log("Inscription terminée");
        return res.status(201).json({message:"Compte créer avec succès."})
      }
    }

  }
  catch(error)//si ca fonctionne pas on renvoie un message d'erreur
  {
    console.error("Erreur lors de la connection à la BDD ou lors de l'inscription");
    return res.status(500).json({error :"Une erreur lors de la connection à la BDD ou lors de l'inscription"});
  }

});

const PORT = 3001;
server.listen(PORT, () =>
  console.log(`Serveur live en ligne http://localhost:${PORT}`)
);