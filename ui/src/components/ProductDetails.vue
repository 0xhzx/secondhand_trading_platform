<template>
    <div class="product-details" v-if="product">
      <div class="product-info">
        <img :src="product.image_url" alt="" class="product-image">
        
      </div>
      <div class="product-meta">
        <div class="product-name">
          <h2>{{ product.product_name }}</h2>
        </div>
        
        <p class="status">Description: {{ product.description }}</p>
        <p class="price">Price: {{ currency(product.price) }}</p>
        <p class="seller">Seller: {{seller_name}}</p>
        <p class="status">Status: 
          <span v-if="product.is_sold">Sold</span>
          <span v-else>Unsold</span>
        </p>
        <div class="buttons">
        <button class="edit-button" @click="order_item"  v-if="!product.is_sold" >Order</button>
        <button class="edit-button unlist-button" v-if="isAdmin" @click="unList">Unlist</button>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted, Ref, inject } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import {fetchProductById, fetchUsernameWithProduct, deleteProduct, orderProduct} from '../api/productApiService';
  import { useToast } from 'vue-toastification';

  // Format price as currency
  const currency = (value: number) => {
    return `$${value}`;
  };
  
  export interface productType {
    _id: string
    product_name: string;
    price: number;
    seller_id: string;
    description: string;
    image_url: string;
    modified_at: Date;
    is_sold: boolean;
    is_deleted: boolean;
  }

  export interface orderType {
    buyer_id: string;
    seller_id: string;
    product_id: string;
    modified_at: Date;
    created_at: Date;
  }

  const route = useRoute();
  const product = ref<productType | null>(null);
	const seller_name = ref("");

  const user: Ref<any> = inject("user")!
  const userRole = ref<string[]>([])
  const isAdmin = ref(false);
  const toast = useToast();
  const router = useRouter();
  const orderData = ref<orderType | null>(null);
  

  onMounted(async () => {
    userRole.value = user.value.roles;
    isAdmin.value = userRole.value.includes('admin');

    const productId = route.params.id;
    const productData = await fetchProductById(productId.toString());
    // console.log("product data is:",productData.product);
    product.value = productData.product;
		console.log('product:', product.value);
		if (product == null || product.value == null) {
			console.log('product is null');
			return;
		}
		const res_name = await fetchUsernameWithProduct(product?.value.seller_id);
		seller_name.value = res_name.name;
		console.log('seller_name:', seller_name.value);
  });

  const unList = async () => {
    try {
      const res = await deleteProduct((product?.value?._id as any).toString());
      router.push('/');
    } catch (error) {
      toast.error('Failed to unlist product:' + error);
    }
  };

  const order_item = async () => {
    try {
        orderData.value = {
        buyer_id: user.value._id,
        seller_id: product?.value?.seller_id || '',
        product_id: product?.value?._id || '',
        modified_at: new Date(),
        created_at: new Date(),
      };
      const result = await orderProduct((product?.value?._id as any).toString(), orderData.value);
      console.log('order result:', result);
      router.push('/');
    } catch (error) {
      toast.error('Failed to order product:' + error);
    }
  };

  </script>



<style scoped>
.product-details {
  margin-top: 4%;
  display: flex;
  gap: 1rem;
  padding-left: 2rem; /* Add some space on the left */
}

.product-info {
  /* flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;  */
  width: 50%; /* Adjust this value to change the width of the area for the image */
  float: left; /* Align the image area to the left */
}

.product-image {
  width: 100%; /* Make the image take up the full width of its container */
  height: auto; /* Keep the aspect ratio of the image */
  max-height: 55vh; /* Limit the height of the image */
  max-width: 45vw;
  object-fit: contain; /* Make sure the entire image is visible */
}

.product-meta {
  flex: 2;
}

.product-name {
  margin-top : 1%;
  margin-bottom: 4%;
}
.product-info h2 {
  text-align: center;
  font-family: 'Arial', sans-serif; /* Change the font family */
  font-size: 2rem; /* Increase the font size */
  font-weight: bold; /* Make the text bold */
  color: #333; /* Change the text color */
}

.price {
    font-size: 1.2rem;
    font-weight: bold;
}

.seller {
  font-family: 'Arial', sans-serif; /* Change the font family */
  font-size: 1.5rem; /* Increase the font size */
  font-weight: normal; /* Make the text normal */
  color: #666; /* Change the text color */
}

.status {
  font-family: 'Arial', sans-serif; /* Change the font family */
  font-size: 1.5rem; /* Increase the font size */
  font-weight: normal; /* Make the text normal */
  color: #666; /* Change the text color */
}

.edit-button {
  display: flex; /* Add this line */
  align-items: center; /* Add this line */
  justify-content: center; /* Add this line */
  background-color: #33593c; /* Green background */
  border: none; /* Remove border */
  color: white; /* White text */
  /* padding: 7.5px 30px;  */
  text-align: center; /* Centered text */
  text-decoration: none; /* Remove underline */
  display: inline-block;
  font-size: 14px;
  margin: 8% 0px;
  height: 4vh;
  width: 5vw;
  /* line-height: 1vh; */
  cursor: pointer; /* Mouse pointer on hover */
  border-radius: 12px; /* Rounded corners */
  transition-duration: 0.4s; /* Transition effect */
  margin-right: 2vw;
}

.unlist-button {
   /* Add some space between the buttons */
  background-color: darkred; /* Change the color of the Unlist button to dark red */
  /* color: white;  */
}


.edit-button:hover {
  opacity: 0.8;
  background-color: #447751; /* Green background on hover */
}

.unlist-button:hover {
  opacity: 0.8;
  background-color: rgb(66, 2, 2); /* Change the color of the Unlist button to dark red */
  /* color: white;  */
}



@media (max-width: 480px) {
  .product-details {
    display: flex;
    flex-direction: row; /* Use row layout for larger screens */
    padding: 2rem;
  }

  .product-info {
    width: 50%; /* Adjust width for image area */
  }

  .product-meta {
    flex: 2;
  }

  .product-name h2 {
    font-size: 1.5rem; /* Larger font size for desktop */
  }

  .price, .seller, .status {
    font-size: 1.2rem;
  }

  .buttons {
    margin-top: 20px;
    display: flex; /* Align buttons horizontally */
    justify-content: center; /* Center buttons */
    gap: 10px; /* Add space between buttons */
  }

  .edit-button, .unlist-button {
    width: auto; /* Auto width for desktop */
    margin: 2% 0;
    padding: 7.5px 30px; /* Adjust padding */
    font-size: 14px; /* Smaller font size for desktop */
  }
}

</style>
