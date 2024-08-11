
// create a lisitng

import Order, { IOrder } from '../models/Order';
import { IProduct } from '../models/Product';
import Product from '../models/Product';
import User from '../models/User';
import { IUser } from '../models/User';

// get user's listings by user id
export async function fetchListings(userId: any): Promise<IProduct[] | Error> {
  try {
    console.log("in fetchListings, userId is", userId);
    const existingUser: IUser | null = await User.findOne({ user_id : userId });

    // if user does not exist, throw an error
    if (!existingUser) {
      throw new Error('User does not exist');
    }
    
    const listings = await Product.find({
      seller_id: userId,
      is_deleted: false,
    });

    return listings;
  } catch (error) {
    console.error('Error fetching listings:', error.message);
    throw new Error(error.message);
  }
}

// get listing detail by listing id
export async function fetchListingDetail(listingId: string): Promise<IProduct | Error> {
  try {
    const listing = await Product.findOne({ _id: listingId, is_deleted: false});
    // check if listing exists
    if (!listing) {
      throw new Error('Listing does not exist');
    }
    return listing;
  } catch (error) {
    console.error('Error fetching listing:', error.message);
    throw new Error(error.message);
  }
}


// create
export async function createListing(userId: string, listing: IProduct) {
  console.log('createListing:', listing);
  try {
    const product = new Product({
      product_name: listing.product_name,
      price: listing.price,
      seller_id: userId,
      description: listing.description,
      image_url: listing.image_url,
      used_status: listing.used_status,
      modified_at: new Date(),
      is_sold: false,
      is_deleted: false,
    });
    // use mongoose to save the product to the database
    const savedProduct = await product.save();
    console.log('Product savedxxx:', savedProduct);
    return savedProduct;
  } catch (error) {
    console.error('Error insert a listing:', error.message);
    throw new Error(error.message);
  }
}

export async function updateListing(listingId: string, listing: IProduct) {
  try {
    const updatedProduct = await Product.findOneAndUpdate( { _id: listingId }, listing, { new: true } );
    if (!updatedProduct) {
      throw new Error('Listing not found');
    }
    return updatedProduct;
  } catch (error) {
    console.error('Error updating a listing:', error.message);
    throw new Error(error.message);
  }
}


export async function deleteListing(listingId: string) {
  try {
    const deletedProduct = await Product.findOneAndUpdate( { _id: listingId }, { is_deleted: true }, { new: true });
    if (!deletedProduct) {
      throw new Error('Listing not found');
    }
    return deletedProduct;
  } catch (error) {
    console.error('Error deleting a listing:', error.message);
    throw new Error(error.message);
  }
}