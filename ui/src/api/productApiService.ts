// export interface ApiRequestParams {
//     endpoint: string;
//     method: string;
//     data?: any;
//     requireAuth?: boolean;
//   }
  
//   // send request to the server
// async function apiRequest({ endpoint, method, data, requireAuth = false }: ApiRequestParams) {
//     const headers = new Headers();
  
//     if (method !== 'GET') {
//       headers.append('Content-Type', 'application/json');
//     }
//     // add access token to the request header, then send to backend server
//     if (requireAuth) {
//         const token = localStorage.getItem('access_token');
//         if (token) {
//           headers.append('Authorization', `Bearer ${token}`);
//         } else {
//           throw new Error('No access token provided');
//         }
//     }
  
//     const config: RequestInit = {
//         method,
//         headers,
//         body: method !== 'GET' ? JSON.stringify(data) : undefined,
//     };
  
//     const response = await fetch(endpoint, config);
//     const responseData = await response.json();
//     console.log(response);
//     if (!response.ok) {
//         throw new Error(`HTTP status: ${response.status} + ", msg: " + ${responseData.message}`);
//     }
  
//     return responseData
// }

import { apiRequest, ApiRequestParams } from './apiRequest';
import {productType, orderType} from '../components/Products.vue';

// Fetch all products
export async function fetchAllProducts() {
  const params: ApiRequestParams = {
    endpoint: '/api/products',
    method: 'GET',
  };
  return apiRequest(params);
}

export async function fetchUsernameWithProduct(userId: string) {
  const params: ApiRequestParams = {
    endpoint: `/api/users/${userId}`,
    method: 'GET',
  };
  return apiRequest(params);
}

// Fetch a single product by ID
export async function fetchProductById(productId: string) {
  const params: ApiRequestParams = {
    endpoint: `/api/products/${productId}`,
    method: 'GET',
  };
  return apiRequest(params);
}

// Create a new product
export async function createProduct(productData: productType) {
  const params: ApiRequestParams = {
    endpoint: '/api/products',
    method: 'POST',
    data: productData,
  };
  return apiRequest(params);
}

// Update a product
export async function updateProduct(productId: string, productData: productType) {
  const params: ApiRequestParams = {
    endpoint: `/api/products/${productId}`,
    method: 'PUT',
    data: productData,
  };
  return apiRequest(params);
}

// Delete a product by ID
export async function deleteProduct(productId: string) {
  const params: ApiRequestParams = {
    endpoint: `/api/products/${productId}`,
    method: 'DELETE',
  };
  return apiRequest(params);
}

export async function orderProduct(productId: string, orderData: orderType) {
  const params: ApiRequestParams = {
    endpoint: `/api/products/${productId}`,
    method: 'POST',
    data: orderData,
  };
  return apiRequest(params);
}

// unlist a product by ID
// export async function unlistProductById(productId: number, data: { isListed: boolean }) {
//   const params: ApiRequestParams = {
//     endpoint: `/api/products/${productId}`,
//     method: 'PUT',
//     data 
//   };
//   return apiRequest(params);
// }
