import User  from '../models/User';
import Order from '../models/Order';
import Product from '../models/Product';

import { IOrder } from '../models/Order'; 
import { IUser } from '../models/User';
import { IProduct } from '../models/Product';

// export async function fetchUser(save_user_name: any) {
//     // create a new user
//     // find the user by username
//     try {
//         // 通过username查找用户
//         const existingUser: IUser | null = await User.findOne({ user_name: save_user_name });
    
//         if (existingUser) {
//           // if existingUser is not null, return an error
//           console.log("User info", existingUser);
//           console.log("User name is ", existingUser.user_name);
//           console.log("User id is ", existingUser._id);
//           return { success: 'User exist' };
//         } else {
//           return { error: 'User do not exist' };
//         }
//       } catch (error) {
//         console.error('Error fetching user:', error);
//         return { error: 'Error fetching user' };
//       }

//     // const existingUser =  User.findOne({ user_name: save_user_name })
//     // .then((existingUser) => {
//     // if (existingUser) {
//     //     // if the user exists, return an error
//     //     return { error: 'User already exists' };
//     // }
//     // })
//     // return existingUser;
// }



// get user's orders by user id
export async function fetchOrders(userId: any): Promise<IOrder[] | Error> {
  try {
    console.log("in fetchOrders, userId is", userId);
    const existingUser: IUser | null = await User.findOne({ user_id : userId });

    // if user does not exist, throw an error
    if (!existingUser) {
      throw new Error('User does not exist');
    }
    
    const orders = await Order.find({
      buyer_id: userId,
    });

    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    throw new Error(error.message);
  }
}

export async function fetchUsername(userId: string): Promise<string | Error> {
  try {
    const user = await User.findOne({ user_id: userId });
    console.log("\n\n\nuser\n\n\n", user);
    const name = user?.name;
    return name;
  } catch (error) {
    console.error('Error fetching user:', error.message);
    throw new Error(error.message);
  }
}