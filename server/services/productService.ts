
import Product from '../models/Product';

import { IProduct } from '../models/Product';
import User from '../models/User';



// get all products
export async function fetchAllProducts(): Promise<IProduct[] | Error> {
  try {
    const products = await Product.find({is_deleted: false, is_sold: false});
    // console.log("\n\n\nproducts\n\n\n", products);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error.message);
    throw new Error(error.message);
  }
}

export async function fetchProductById(productId: string): Promise<IProduct | Error> {
  try {
    const product = await Product.findById(productId);
    return product;
  }
  catch (error) {
    console.error('Error fetching product:', error.message);
    throw new Error(error.message);
  }
}

export async function orderProduct(productId: string): Promise<IProduct | Error> {
  try {
    const orderedProduct = await Product.findOneAndUpdate( { _id: productId, is_sold: false }, { is_sold: true }, { new: true });
    if (!orderedProduct) {
      throw new Error('Product is Sold!');
    }
    return orderedProduct;
  } catch (error) {
    console.error('Error order a product:', error.message);
    throw new Error(error.message);
  }
}
