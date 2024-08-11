import { Router, Request, Response } from 'express';
import { fetchAllProducts, fetchProductById, orderProduct } from '../services/productService';
import { checkAuthenticated, checkRole } from '../utils/auth';
import { ADMIN, USER } from '../config/config';
import {fetchListingDetail, deleteListing } from '../services/listingService';
import { IProduct } from '../models/Product';
import { createOrder } from '../services/orderService';


const router = Router();

export function setup(passport: any) {
// get all products
router.get('', async (req: Request, res: Response) => {
    console.log('fetching all products');
    try{
        const products = await fetchAllProducts();
        // console.log("products", products);
        res.json({products});
    }catch(error){
        console.error('Error fetching products:', error);
        res.status(500).json({ message: "Failed to retrieve products" });
    }
})


// get a product by id
router.get('/:id', async (req: Request, res: Response) => {
    console.log('\n\nfetching product with id', req.params.id);
    try {
      const product = await fetchProductById(req.params.id);
    //   console.log("product", product);
      res.json({ product });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: "Failed to retrieve product" });
    }
  });


// order a product by id
router.post('/:id', checkAuthenticated, async (req: Request, res: Response) => {
  console.log('\n\Ordering product with id', req.params.id);
  const productId = req.params.id;
  const order = req.body;
  if(!productId || !order){  
    res.status(400).json({ message: "Missing productId or order" });
    return;
  }
  try {
    const ordered_product = await orderProduct(productId);
    const userId = (req.session as any).passport.user.user_id;
    const result = await createOrder(userId, order);
    res.json({ data: result });
  } catch (error) {
    console.error('Error ordering a product:', error);
    res.status(500).json({ message: "Error ordering a product: " + error.message });
  }
});


// delete a product by id, this is different from delete from url /users/lisings/:id
router.delete('/:id', checkAuthenticated, checkRole([ADMIN]), async (req: Request, res: Response) => {
  const productId = req.params.id;

  // check if productId is missing
  if (!productId) {
    res.status(400).json({ message: "Missing productId" });
    return;
  }

  try {

    const result = await deleteListing(productId);
    res.json({ data: result });

  } catch (error) {
    console.error('Error unlisting a product:', error);
    res.status(500).json({ message: "Failed to unlist" });
  }
});

return router
}
// export default router;