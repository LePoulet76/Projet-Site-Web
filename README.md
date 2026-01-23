  Blindtest.io

  Ce projet a pour but de réaliser un site web qui permet aux utilisateur de se rassembler autour d'un blindtest avec différents thèmes : film, série ou animé.
  Il dispose d'un système de comptes, de partie et n'importe quel joueur peu créer une partie pour jouer avec n'importe qui !

  Sur ce projet, nous étions 3 :
  - Emma Orain sur la partie connection/gestion des comptes
  - Gratien XMA sur le design et les liaisons avec React
  - Arthur Poulain sur la base de données et le direct avec Socket.io

  Nous avons utilisé les technologies suivantes : 
  - React pour les pages interactives
  - Socket.io pour la gestion du jeux en direct
  - Tailwind pour le design des pages
  - mysql pour la base de données (hebergée sur ce serveur : 49.13.235.112)
  - Node.js pour l'API et les musiques récupérées depuis le backend

  Au niveau des bugs connus : 
  - La musique continue même quand la partie est terminée
  - Partie en jeux detruite en cas de rechargement
  - Les Joker ne marchent pas (pas eu le temps d'implémenter)
  - On peut repondre plusieurs fois à la meme question et avoir des points
  - Coté base de données, les lobbies ne sont jamais nettoyés 
