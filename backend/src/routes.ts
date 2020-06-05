import express from 'express';
import multer from 'multer';

import multerConfig from './configs/multer'
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const pointsController = new PointsController;
const itemsController = new ItemsController;

const routes = express.Router();
const upload = multer(multerConfig);

routes.get('/items', itemsController.index );

routes.post('/points', upload.single('image') ,pointsController.create);
routes.get('/points/:id', pointsController.show);
routes.get('/points/', pointsController.index);


export default routes;