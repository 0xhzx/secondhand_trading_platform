import { Router, Request, Response } from 'express';
import user from './userController';
import product from './productController';

const router = Router();

router.use('/users', user);
router.use('/products', product);


export default router


