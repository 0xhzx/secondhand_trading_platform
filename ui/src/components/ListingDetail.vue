<template>
  <div class="product-details">
    <div class="product-info">
      <img :src="listingDetail.image_url" alt="" class="product-image">
    </div>
    <div class="product-meta">
      <div class="product-name">
        <h2>Product Name: {{ listingDetail.product_name }}</h2>
      </div>
      <p class="price">Description: {{ listingDetail.description }}</p>
      <p class="price">Price: ${{ listingDetail.price }}</p>
      <p class="price" >Used Status: {{ listingDetail.used_status }} </p >
      <p class="status">Status: 
        <span v-if="listingDetail.is_sold">Sold</span>
        <span v-else>Unsold</span>
      </p>

      <button class="edit-button" @click="goToEditPage">Edit</button> <!-- Add this line -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, Ref } from 'vue';
import { useRouter } from 'vue-router';
import {fetchProductById, fetchUsernameWithProduct} from '../api/productApiService';
import { getListingDetailApi } from '../api/accountApiService';
import { useToast } from 'vue-toastification';

interface ListingDetail {
  _id: string
  product_name: string;
  price: number;
  seller_id: string;
  description: string;
  image_url: string;
  modified_at: Date;
  used_status: string;
  is_sold: boolean;
}

const toast = useToast();
const router = useRouter();

const listingDetail = ref<ListingDetail>(
  {
    _id: '',
    product_name: '',
    price: 0,
    seller_id: '',
    description: '',
    image_url: '',
    used_status: '',
    modified_at: new Date(),
    is_sold: false,
  }
);

const editMode = ref(false);

async function getListingDetail() {
  const listingId = router.currentRoute.value.params.id;

  try {
    const res = await getListingDetailApi(listingId.toString());
    listingDetail.value = res.data;

    if (listingDetail == null || listingDetail.value == null) {
      console.log('listing is null');
      return;
    }
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      const match = /HTTP status: (\d+)/.exec(message);
      if (match) {
        const statusCode = parseInt(match[1], 10);
        if (statusCode === 403) {
          toast.error('No permission. You are not the seller of this listing.');
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          toast.error('Failed to get listing detail: ' + error);
        }
      }
    }
  }
}

onMounted(async () => {
  await getListingDetail();
});

const goToEditPage = () => {
  router.push(`/edit-listing/${listingDetail.value._id}`);
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
}

.edit-button:hover {
  opacity: 0.8;
  background-color: #447751; /* Green background on hover */
}
</style>
