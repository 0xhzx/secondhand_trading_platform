// export interface ApiRequestParams {
//   endpoint: string;
//   method: string;
//   data?: any;
//   requireAuth?: boolean;
// }

// // send request to the server
// async function apiRequest({ endpoint, method, data }: ApiRequestParams) {
//   const headers = new Headers();

//   if (method !== 'GET') {
//     headers.append('Content-Type', 'application/json');
//   }
//   // add access token to the request header, then send to backend server
//   // if (requireAuth) {
//   //     const token = localStorage.getItem('access_token');
//   //     if (token) {
//   //       headers.append('Authorization', `Bearer ${token}`);
//   //     } else {
//   //       throw new Error('No access token provided');
//   //     }
//   // }

//   const config: RequestInit = {
//       method,
//       headers,
//       body: method !== 'GET' ? JSON.stringify(data) : undefined,
//   };

//   const response = await fetch(endpoint, config);
//   const responseData = await response.json();
//   console.log(response);
//   if (!response.ok) {
//       throw new Error(`HTTP status: ${response.status} + ", msg: " + ${responseData.message}`);
//   }

//   return responseData
// }

import { apiRequest, ApiRequestParams } from './apiRequest';
import { Listing } from '../components/PostListing.vue';

// place an order
export async function placeOrder(userId: number, order: any) {
  const params: ApiRequestParams = {
    endpoint: `/api/users/${userId}/orders`, // path to the server
    method: 'POST', // http request method, get post put delete
    data: order, // data
  };
  return apiRequest(params);
}

export async function checkLogin() {
  const params: ApiRequestParams = {
    endpoint: '/api/users/check-login',
    method: 'GET',
  };
  return apiRequest(params);
}


// resgiter an account
export async function registerAccount(email: string, password: string, firstname: string, lastname: string) {
  const params: ApiRequestParams = {
    endpoint: '/api/users/register',
    method: 'POST',
    data: {
      email,
      password,
      firstname,
      lastname
    }
  };
  return apiRequest(params);
}

// login
export async function loginAccount(email: string, password: string) {
  const params: ApiRequestParams = {
    endpoint: '/api/users/login',
    method: 'POST',
    data: {
      email,
      password
    }
  };
  return apiRequest(params);
}

// write a funcution to login, using GET method, 
export async function login() {
  const params: ApiRequestParams = {
    endpoint: '/api/users/login',
    method: 'GET',
  };
  return apiRequest(params);
}

// logout 
export async function logoutApi() {
  const params: ApiRequestParams = {
    endpoint: '/api/users/logout',
    method: 'GET',
  };
  return apiRequest(params);
}

// get user's id from the server
export async function fetchUserId() {
  const params: ApiRequestParams = {
    endpoint: '/api/users/me',
    method: 'GET',
  };
  return apiRequest(params);
}

// update user's password 
export async function updateUserPassword(userId: number, newPassword: string, confirmNewPassword: string, currentPassword: string) {
  const params: ApiRequestParams = {
    endpoint: `/api/users/${userId}/password`,
    method: 'PUT',
    data: {
      newPassword,
      confirmNewPassword,
      currentPassword
    },
  };
  return apiRequest(params);
}

// update user's profile
export async function updateUserProfile(userId: number, email: string, firstname: string, lastname: string) {
  const params: ApiRequestParams = {
    endpoint: `/api/users/${userId}`, 
    method: 'PUT',
    data: {
      email,
      firstname,
      lastname
    },
  };
  return apiRequest(params);
}

// getOrders from the server
export async function getOrdersApi() {
  const params: ApiRequestParams = {
    endpoint: `/api/users/orders`,
    method: 'GET',
  };
  return apiRequest(params);
}


// getOrderDetail by id from the server
export async function getOrderDetailApi(orderId: string) {
  const params: ApiRequestParams = {
    endpoint: `/api/users/orders/${orderId}`,
    method: 'GET',
  };
  return apiRequest(params);
}

// get all listings by user id
export async function getListingsApi() {
  const params: ApiRequestParams = {
    endpoint: `/api/users/listings`,
    method: 'GET',
  };
  return apiRequest(params);
}

// post a new listing
export async function postListingApi(listing: Listing) {
  const params: ApiRequestParams = {
    endpoint: `/api/users/listings`,
    method: 'POST',
    data: listing,
  };
  return apiRequest(params);
}

// update a listing
export async function updateListingApi(listingId: string, listing: Listing) {
  const params: ApiRequestParams = {
    endpoint: `/api/users/listings/${listingId}`,
    method: 'PUT',
    data: listing,
  };
  return apiRequest(params);
}

// get listing detail
export async function getListingDetailApi(listingId: string) {
  const params: ApiRequestParams = {
    endpoint: `/api/users/listings/${listingId}`,
    method: 'GET',
  };
  return apiRequest(params);
}

export async function deleteListingApi(listingId: string) {
  const params: ApiRequestParams = {
    endpoint: `/api/users/listings/${listingId}`,
    method: 'DELETE',
  };
  return apiRequest(params);
}