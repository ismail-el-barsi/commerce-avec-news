import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

export const sendGrid = () => {
  sgMail.setApiKey(process.env.SEND_GRID);
  return sgMail;
};

export const sendProductCreationEmail = async (user, product) => {
  const sgMail = sendGrid();
  const msg = {
    to: `${user.username} <${user.email}>`,
    from: `Votre Store <${process.env.SENDER_EMAIL}>`,
    subject: 'Nouveau produit créé avec succès !',
    html: `
      <p>Bonjour ${user.username},</p>
      <p>Votre nouveau produit "${product.name}" a été créé avec succès.</p>
      <p>Voici les détails du produit :</p>
      <ul>
        <li>Nom : ${product.name}</li>
        <li>Prix : €${product.price}</li>
        <li>Catégorie : ${product.category}</li>
        <li>Description : ${product.description}</li>
        <li>Stock : ${product.stock}</li>
      </ul>
      <p>Merci d'ajouter un nouveau produit à votre boutique !</p>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de création de produit :",
      error
    );
    throw new Error("Erreur lors de l'envoi de l'email de création de produit");
  }
};

export const sendNewsCreationEmail = async (user, news) => {
  const sgMail = sendGrid();
  const msg = {
    to: `${user.username} <${user.email}>`,
    from: `Votre News Service <${process.env.SENDER_EMAIL}>`,
    subject: 'Nouvelle news créée avec succès !',
    html: `
      <p>Bonjour ${user.username},</p>
      <p>Votre nouvelle news "${news.title}" a été créée avec succès.</p>
      <p>Voici les détails de la news :</p>
      <ul>
        <li>Titre : ${news.title}</li>
        <li>Contenu : ${news.content}</li>
      </ul>
      <p>Merci d'ajouter une nouvelle actualité à notre plateforme !</p>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation de news :", error);
    throw new Error("Erreur lors de l'envoi de l'email de confirmation de news");
  }
};