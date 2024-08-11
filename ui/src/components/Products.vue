<template>
  <div class="products-page">
    
    <div class="sorting">
      <div class="product-header">Deals</div>
      <b-dropdown id="dropdown-1" text="Sort By" class="m-md-2">
        <b-dropdown-item @click="sortByTime">Sort by Time</b-dropdown-item>
        <b-dropdown-item @click="sortByPrice">Sort by Price</b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="products-list">
      <div class="product" v-for="product in sortedProducts" :key="product._id">
        <img :src="product.image_url" alt="" class="product-image">
          <router-link :to="{ name: 'ProductDetails', params: { id: product._id} }">
            <h3 class="product-name">{{ product.product_name }}</h3>
          </router-link>
        <p class="rating">{{ product.description }}</p>
        <p class="price">{{ currency(product.price) }}</p>
        <p class="rating">Seller: {{ seller_names[product.seller_id] }}</p>
        <p class="rating">Status: 
          <span v-if="product.is_sold">Sold</span>
          <span v-else>Unsold</span>
        </p>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, watch, onMounted, Ref } from 'vue';
  import { fetchAllProducts, fetchUsernameWithProduct } from '../api/productApiService'; // Import the API function

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

  const topK = ref(null);
  const products = ref<productType[]>([]); // Now starts empty, to be filled with actual product data from the backend.
  const originalProducts = ref<productType[]>([]);
  const sortedProducts = ref<productType[]>([]);
  const seller_names: Ref<Record<string, string>> = ref({});


  // Format price as currency
  const currency = (value: number) => {
    return `$${value}`;
  };

  // Define the function to fetch all products from the backend
  const getAllProducts = async () => {
    try {
      const fetchedProducts = await fetchAllProducts();
      // console.log('Fetched products:', fetchedProducts.products);

      products.value = fetchedProducts.products;
      originalProducts.value = [...products.value];
      // keep a copy of the original products for resetting
      sortedProducts.value = [...products.value];
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  // Automatically fetch products when the component is mounted
  onMounted( async () => {
    await getAllProducts();
    for(const product of products.value){
        const seller_name = await fetchUsernameWithProduct(product.seller_id);
        seller_names.value[product.seller_id] = seller_name.name;
    }
  });

  // Function to sort and filter products.
  const sortByTime = () => {
    // Sort products by price
    sortedProducts.value = [...products.value].sort((a, b) => {
      const dateA = new Date(a.modified_at);
      const dateB = new Date(b.modified_at);
      return +dateB - +dateA; // sort in descending order
    });
  };

  const sortByPrice = () => {
    // Sort products by time
    sortedProducts.value = [...products.value].sort((a, b) => {
      return b.price - a.price;
    });
  };

  // Watcher to auto sort products when topK changes
  watch(topK, (newValue) => {
    if (newValue === '' || newValue === null || newValue === 0 || newValue < 0) {
      sortedProducts.value = [...originalProducts.value];
    }
  });
  </script>
  
  <style scoped>
  .products-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .product-header {
    font-size: 20px;
    margin-right: 1vw;
    font-weight: bold;
  }
  
  
  /* .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
  } */


  /* .title {
    font-size: 2rem;
    font-weight: bold;
  } */
  
  /* .search-input {
    flex-grow: 1;
    margin: 0 15px;
    padding: 10px;
  } */
  
  .icons {
    display: flex;
    gap: 10px;
  }
  
  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
  }
  
  .products-list {
    margin-top: 20px;
    display: flex;
    flex-direction: row; /* Change direction to row */
    flex-wrap: wrap;
    /* justify-content: flex-start; Align items to the start of the row */
    gap: 20px;
  }

  .product {
      display: flex;
      flex: 1 0 30%; /* Each product will take up 30% of the row width */
      max-width: 30%; /* Each product will take up 30% of the row width */
      flex-direction: column;
      /* align-items: flex-start;  */
      justify-content: flex-start; /* Align items to the start of the flex container */
  }
    
  .product-image {
    width: 70%;
    height: 70%;
    margin: auto; /* Centers the image horizontally in the container */
    display: block; /* Ensures the image is treated as a block element for centering purposes */
    object-fit: contain;
    /* max-width: 200px;
    max-height: 200px;
    min-width: 200px;
    min-height: 200px; */
  }

  .product-name {
    font-size: 1.3rem;
    font-weight: bold;
    color: black;
    margin: 10px 0;
    /* align-self: center; */
    text-align: center;
    width: 100%;
  }
  
  .price {
    text-align: flex-start;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .sorting {
    margin-left: 4vw;
    display: flex;
    align-items: center;
  }

/* ... rest of your CSS ... */
  .sorting input[type="number"] {
    margin: 0 10px;
    padding: 5px;
  }
 
  
@media (max-width: 480px) {
  .products-list {
    flex-direction: column; /* Change direction to column */
    align-items: center; /* Align items to the center of the flex container */
    
  }
  .product {
    /* align center */
    align-items: center;
    max-width: 80%; /* Ensure each product occupies a full row on its own */
    width: 100%; /* Ensure each product occupies a full row on its own */
    margin: 20px;
  }
  .products-page {
    padding: 10px;
  }

  .product-image {
    /* max-width: 100%;
    max-height: 50%;
    min-width: 100%;
    min-height: 50%; */
    width: 90%;
    height: 90%;
    object-fit: contain
    ;
  }
}
  </style>
  
  