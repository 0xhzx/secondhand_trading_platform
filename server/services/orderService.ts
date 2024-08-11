import { IOrder } from '../models/Order';
import Order from '../models/Order';
import User from '../models/User';
import { IUser } from '../models/User';


// create an order
export async function createOrder(userId: string, orderData: IOrder) {
  try {
    orderData.buyer_id = userId;
    const order = new Order(orderData);
    await order.save();
    return order;
  } catch (error) {
    console.error('Error creating an order:', error.message);
    throw new Error(error.message);
  }
}

// get orders by buyer id
export async function fetchOrdersByBuyerId(buyerId: string): Promise<IOrder[] | Error> {
  try {
    const orders = await Order.find({ buyer_id: buyerId, is_deleted: false });
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    throw new Error(error.message);
  }
}

// get order detail by order id
export async function fetchOrderDetail(orderId: string): Promise<IOrder | Error> {
  try {
    const order = await Order.findOne({ _id: orderId, is_deleted: false });
    if (!order) {
      throw new Error('Order does not exist');
    }
    return order;
  } catch (error) {
    console.error('Error fetching order:', error.message);
    throw new Error(error.message);
  }
}

// update an order
export async function updateOrder(orderId: string, orderData: IOrder) {
  try {
    const updatedOrder = await Order.findOneAndUpdate({ _id: orderId }, orderData, { new: true });
    if (!updatedOrder) {
      throw new Error('Order not found');
    }
    return updatedOrder;
  } catch (error) {
    console.error('Error updating an order:', error.message);
    throw new Error(error.message);
  }
}

// delete an order
export async function deleteOrder(orderId: string) {
  try {
    const deletedOrder = await Order.findOneAndUpdate({ _id: orderId }, { is_deleted: true }, { new: true });
    if (!deletedOrder) {
      throw new Error('Order not found');
    }
    return deletedOrder;
  } catch (error) {
    console.error('Error deleting an order:', error.message);
    throw new Error(error.message);
  }
}