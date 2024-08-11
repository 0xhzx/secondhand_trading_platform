
<template>
    <div class="order-history">
      <div class="header">
        <div class="title-and-button"> 
          <h1>My Listings</h1>
          <button class="post-listing" @click="goToPostListing">Post a Listing</button> 
        </div>
        <div class="sort-and-search">
          <b-dropdown id="dropdown-1" text="Sort By" class="m-md-2 custom-dropdown">
            <b-dropdown-item class="custom-dropdown-item" @click="sortByTime">Sort by Time</b-dropdown-item>
            <b-dropdown-item class="custom-dropdown-item" @click="sortByPrice">Sort by Price</b-dropdown-item>
          </b-dropdown>
          <!-- <input type="text" placeholder="Search for orders..." v-model="searchTerm" @input="searchOrders"> -->
        </div>
      </div>
  
      <div class="orders-container">
        <div class="order" v-for="listing in sortedListings" :key="listing._id" >
          <div>Product Name: {{ listing.product_name }}</div>
          <div>Price: {{ listing.price }}</div>
          <!-- <div>Is Sold: {{ listing.is_sold }}</div> -->
          <div>Is Sold: 
            <span v-if="listing.is_sold">Sold</span>
            <span v-else>Unsold</span>
          </div>
          <div>Posted Date: {{ new Date(listing.modified_at ?? '').toLocaleString('en-US') }}</div>
          <!-- <div class="button-group"> -->
            <button class="delete-button" @click="deleteListing(listing._id)">Delete</button>
            <button class="detail-button" @click="goToDetail(listing._id)">Go to Detail</button>
          <!-- </div> -->
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useToast } from 'vue-toastification';
  import { useRouter } from 'vue-router';
  import { getListingsApi, deleteListingApi } from '../api/accountApiService.ts';
  
  interface Listing {
    _id: string;
    product_name: string;
    price: number; // use number for Double type in TypeScript
    seller_id: string;
    description?: string;
    image_url?: string;
    modified_at?: string; // use string if the date is serialized to a string
    is_sold: boolean;
  }

  const listings = ref<Listing[]>([]);
  const sortedListings = ref<Listing[]>([]);
  
  const router = useRouter();
  const toast = useToast();
  const sortKey = ref('date');
  const searchTerm = ref('');
  
  const fetchListings = async () => {
    try {
      console.log('Fetching orders...');
      const response = await getListingsApi();
      listings.value = response.listings;
      sortByTime();
    } catch (error) {
      toast.error('Failed to get order history: ' + error);
    }
  };
  
  onMounted(fetchListings);
  
  const goToPostListing = () => {
    router.push('/post-listing');
  };
  
  const goToDetail = (id: string) => {
    router.push(`/listings/${id}`);
  };
  
  const deleteListing = async (id: string) => {
    try {
      console.log('Deleting listing...');
      const response = await deleteListingApi(id);
      fetchListings();
      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Failed to delete listing: ' + error);
    }
  };

  const sortByTime = () => {
    // Sort products by price
    sortedListings.value = [...listings.value].sort((a, b) => {
      const dateA = new Date(a.modified_at ?? '');
      const dateB = new Date(b.modified_at ?? '');
      return +dateB - +dateA; // sort in descending order
    });
  };

  const sortByPrice = () => {
    // Sort products by price, descending
    sortedListings.value = [...listings.value].sort((a, b) => {
      return b.price - a.price;
    });
  };

  
  </script>
  
  
  <style scoped>
  .order-history {
    font-family: 'Arial', sans-serif;
    margin: auto;
  }

  .title-and-button {
  display: flex;
  flex-grow: 1; 
  align-items: center;
  /* justify-content: space-between; */
  }
  
  .post-listing {
    white-space: nowrap; /* Ensures button text doesn't wrap */
    /* padding: 0.5rem 1rem;  */

    margin-left: 2%;

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
    height: 5vh;
    width: 8vw;
    /* line-height: 1vh; */
    cursor: pointer; /* Mouse pointer on hover */
    border-radius: 12px; /* Rounded corners */
    transition-duration: 0.4s; /* Transition effect */
  }
  
  .post-listing:hover {
    opacity: 0.8;
    background-color: #447751; /* Green background on hover */
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    padding: 1rem;
    border-bottom: 1px solid #ccc;
    margin-bottom: 2%;
  }
  
  .sort-and-search select,
  .sort-and-search input {
    padding: 0.5rem;
    margin-left: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  

  .orders-container {
  
    .order {
      border: 1px solid #eaeaea;
      padding: 15px;
      margin-bottom: 10px;
      position: relative;
      border-radius: 20px;
      
      /* &:hover {
        background-color: #f9f9f9;
      } */
    }

    .order > div {
      margin-bottom: 5px;
    }
    .order:hover {
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
    }
    
    .button-group {
      display: flex;
      justify-content: space-between;
    }

    .detail-button {
      position: absolute;
      top: 10px;
      right: 10px;
      border: none;
      background-color: #f1f1f1;
      border-radius: 10px;
      cursor: pointer;
      padding: 5px 10px;
      font-size: 12px;
      
      &:hover {
        background-color: #e1e1e1;
      }
    }

    .delete-button {
      position: absolute;
      top: 10px;
      right: 110px;
      border: none;
      background-color: #f1f1f1;
      border-radius: 10px;
      cursor: pointer;
      padding: 5px 10px;
      font-size: 12px;
      
      &:hover {
        background-color: #e1e1e1;
      }
    }

    

    button:hover {
      background-color: #4cae4c; /* A darker shade of 'success' color */
    }
  }


  </style>