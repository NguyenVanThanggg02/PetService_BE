import express from 'express';
import { serviceController } from '../controllers/index.js';

const serviceRouter = express.Router();

serviceRouter.get('/', serviceController.fetchAllService);

export default serviceRouter;
