const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dzzvuljib/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'cs590-image';

export interface ApiRequestParams {
  endpoint: string;
  method: string;
  data?: any;
  contentType?: null;
}
  

export async function fileApiRequest({ endpoint, method, data, contentType }: ApiRequestParams) {
  const headers = new Headers();

  if (contentType) {
    headers.append('Content-Type', contentType);
  } else if (method !== 'GET' && !(data instanceof FormData)) {
    headers.append('Content-Type', 'application/json');
    data = JSON.stringify(data);
  }

  const config: RequestInit = {
      method,
      headers,
      body: method !== 'GET' ? data : undefined,
  };

  const response = await fetch(endpoint, config);
  const responseData = await response.json();
  if (!response.ok) {
      throw new Error(`HTTP status: ${response.status}, msg: ${responseData.message}`);
  }

  return responseData;
}

export async function uploadImageToCloudinary(file: any) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const params: ApiRequestParams = {
      endpoint: CLOUDINARY_URL,
      method: 'POST',
      data: formData,
      contentType: null,
  };
  return fileApiRequest(params);
    
  }
  