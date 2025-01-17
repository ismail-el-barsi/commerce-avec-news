import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../../utils.js';
import News from '../Models/newsModels.js';

const newsRouter = express.Router();

newsRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const news = await News.find();
    res.send(news);
  })
);

newsRouter.post(
  '/create',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const news = new News({
        title: req.body.title,
        content: req.body.content,
      });

      const createdNews = await news.save();
      res.status(201).send({
        message: 'News créée avec succès',
        news: createdNews,
      });
    } catch (err) {
      res.status(500).send({ message: 'Erreur lors de la création de la news' });
    }
  })
);

export default newsRouter;
