import express from 'express';

import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const pointsController = new PointsController
const itemsController = new ItemsController

const routes = express.Router();

routes.get('/items', itemsController.index )

routes.post('/points', pointsController.create)

export default routes