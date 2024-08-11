// todo move the basic api request here 



export interface ApiRequestParams {
  endpoint: string;
  method: string;
  data?: any;
  requireAuth?: boolean;
}
  
  // send request to the server
export async function apiRequest({ endpoint, method, data }: ApiRequestParams) {
  const headers = new Headers();

  if (method !== 'GET') {
    headers.append('Content-Type', 'application/json');
  }

  const config: RequestInit = {
      method,
      headers,
      body: method !== 'GET' ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(endpoint, config);
  const responseData = await response.json();
  console.log(response);
  if (!response.ok) {
      throw new Error(`HTTP status: ${response.status} + ", msg: " + ${responseData.message}`);
  }

  return responseData
}