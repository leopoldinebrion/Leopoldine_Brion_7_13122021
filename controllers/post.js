const db = require('../models');
const jwt = require("jsonwebtoken");
const fs = require('fs');

exports.createPost = (req, res, next) => {   
    const content = req.body.content;

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.KEY_TOKEN);
    const userId = decodedToken.userId;
    
    // Permet de vérifier que tous les champs sont complétés
    if (content == null || content == '') {
        return res.status(400).json({ error: 'Tous les champs doivent être renseignés' });
    } 

    // Permet de contrôler la longueur du titre et du contenu du message
    if (content.length <= 4) {
        return res.status(400).json({ error: 'Le contenu du message doit contenir au moins 4 caractères' });
    }
    
    db.User.findOne({
        where: { id: userId }
    })
    
    .then(userFound => {
        if(userFound) {
            const post = db.Post.create({
              UserId: userFound.id,
              title: req.body.title,
              content: req.body.content,
              imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`: req.body.imageUrl,
            })
            post.save()
            .then(() => res.status(201).json({ message: 'Création de post ok !' }))
            .catch(error => res.status(400).json({ error: 'une erreur s\'est produite !' }));
        } else {
            return res.status(404).json({ error: 'Utilisateur non trouvé' })
        }
    })
    .catch(error => res.status(500).json({ error: '⚠ Oops, une erreur s\'est produite !' }));
};
