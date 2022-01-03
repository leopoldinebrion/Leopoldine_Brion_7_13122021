const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const db = require('../models');

exports.signup = async (req, res, next) => {

try {

  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const newUser = await db.User.create({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: passwordHash,
          profilImage: "http",
          isAdmin: false
        }); 
  res.status(201).send(newUser)
} catch(error) {
    res.status(400).send({ error: "erreur" })
}
};

exports.login = async (req, res, next) => {
    
try {
    const user = await db.User.findOne({ where : { email: req.body.email }})
    const checkPassword = await bcrypt.compare(req.body.password, user.password)

    if(!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
    }
    else if(!checkPassword) { 
        return res.status(400).json({error : "Mot de passe incorrect"})
    } else {
        res.status(200).json({
            userId: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            isAdmin: user.isAdmin,
            token: jwt.sign(
            { userId: user.id },
            `${process.env.KEY_TOKEN}`,
              { expiresIn: '24h' }
              )
        });
        }
} catch(error) {
    res.status(500).send({ error: "erreur" })
 }
};

exports.getUserProfil = async (req, res, next) => {
    try {
    const user = await db.User.findOne({
      where: { id: req.params.id },
    });
    res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

exports.getAllUsers = (req, res, next) => {
  db.User.findAll({
    attributes: { exclude: ["email", "password"] },
    id: req.params.id
  })
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json({ error }))
};

exports.updateUserProfil = async (req, res) => {
  const id = req.params.id;
  await db.User.findByPk(id)
    .then((exist) => {
      if (exist) {
        db.User.update(req.body, { where: { id: req.params.id } })
          .then(() => {
            res.status(201).json({ message: 'Profil modifié.' });
          })
          .catch(() => {
            return res.status(500).json({ error: 'An error has occurred.' });
          });
      } else {
        return res.status(404).json({ error: 'UserId ' + id + ' non trouvé.' });
      }
    })
    .catch(() => {
      return res.status(500).json({ error: 'Erreur serveur' });
    });
};
/*
module.exports.deleteUser = async (req, res) => {
  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
*/