<template>
    <div class="address-management">
      <h2>Post a Listing</h2>
      
      <div class="address-form">
        <!-- Form to add a new address -->
        <b-overlay :show="isLoading">
        <form @submit.prevent="submitForm">
          
          <div class="form-group">
            <label for="address-line-1">Product name</label>
            <input type="text" id="address-line-1" v-model="listing.product_name" required>
          </div>
  
          <div class="form-group">
            <label for="address-line-2">Price</label>
            <input type="number" id="address-line-2" v-model="listing.price" required>
            <p v-if="priceError" class="error-message">Price must be a number greater than 0.</p>
          </div>
  
          <div class="form-group">
            <label for="city">Description</label>
            <textarea type="text" id="description" v-model="listing.description" required></textarea>
            <!-- <input type="text" id="city" v-model="listing.description" required> -->
          </div>
          
          <div class="form-group">
            <label for="state">Used Status</label>
            <select id="state" v-model="listing.used_status" class="form-control" required>
              <option value="NEW">NEW</option>
              <option value="GOOD CONDITION">IN GOOD CONDITION</option>
              <option value="USED">USED</option>
              <option value="TRASH">TRASH</option>
            </select>
            <!-- <input type="text" id="state" v-model="listing.used_status" required> -->
          </div>
          
          <div class="form-group">
            <label for="image">Image</label>
            <input type="file" id="image" @change="handleFileUpload" >
          </div>


          <div class="form-actions">
          <button type="button" @click="clearForm">Clear</button>
          <button type="submit">Submit</button>
          </div>
        </form>
        </b-overlay>
      </div>
    </div>
  </template>
  
  
<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useToast } from 'vue-toastification';
  import { postListingApi, getListingDetailApi, updateListingApi } from '../api/accountApiService';
  import { uploadImageToCloudinary } from '../api/uploadImageApiService';
  import { useRouter, useRoute } from 'vue-router';

  export interface Listing {
    product_name: string;
    price: number;
    description: string;
    image_url: string;
    used_status: string;
  }
  
  // New address form and its visibility state
  const listing = ref<Listing>({
    product_name: '',
    price: 0,
    description: '',
    image_url: '',
    used_status: '',
  });

  const toast = useToast();
  const router = useRouter();
  const route = useRoute();

  const listingId = route.params.id;

  const isEditMode = ref(!!listingId);

  const isLoading = ref(false);
  const priceError = ref(false);

  onMounted(async () => {
    console.log("listingId:", listingId)
    if (isEditMode.value) {
      try {
        const response = await getListingDetailApi(listingId.toString());
        listing.value = response.data;
        console.log("listing:", listing.value);
      } catch (error) {
        toast.error('Failed to fetch listing details: ' + error);
      }
    }
  });

  // uplaod image to cloudinary
  const handleFileUpload = async (event: Event) => {
    isLoading.value = true;

    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      // use toase to show error message
      toast.error('uploading image failed');
      return;
    }

    try {
      const response = await uploadImageToCloudinary(file);
      if (response.secure_url) {
        listing.value.image_url = response.secure_url;
        toast.success('Image uploaded successfully');
        // console.log('Upload successful:', response.secure_url);
      } else {
        toast.error('Failed to upload image');
        // throw new Error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Failed to upload image: ' + error);
    } finally {
      isLoading.value = false;
    }
  };
  
  
  // submit listing form
  const submitForm = async () => {
    // check if price is a number greater than 0  
    if (listing.value.price <= 0 || isNaN(listing.value.price)) {
      priceError.value = true;
      return;
    } else {
      priceError.value = false;
    }

    try {
      isLoading.value = true;
      if (isEditMode.value) {
        // update listing
        const res = await updateListingApi(listingId.toString(), listing.value); // You need to implement this function in your API service
        // check if the response is successful
        if (res.data._id) {
          toast.success('Listing updated successfully');
          router.push(`/listings/${listingId}`);
        } else {
          toast.error('Failed to update listing');
        }
      } else {
        // post a new listing
        const res = await postListingApi(listing.value); 
        // check if the response is successful
        if (res.data._id) {
          toast.success('Listing posted successfully');
          clearForm();
          router.push(`/listings/${res.data._id}`);
        } else {
          toast.error('Failed to post the new listing');
        }
      }
    } catch (error) {
      toast.error('Failed to post a listing: ' + error);
    } finally {
      isLoading.value = false;
    }
  };

  // clear form
  const clearForm = () => {
    listing.value = {
      product_name: '',
      price: 0,
      description: '',
      image_url: '',
      used_status: '',
    };
  };

</script>
  
  
  
  
<style scoped>

  .address-management {
    max-width: 600px; 
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  
    h2 {
      margin-bottom: 20px;
    }
  
    .add-address-btn {
      background-color: #000;
      color: #fff;
      padding: 10px 20px;
      border: none;
      cursor: pointer;
      display: block;
      width: 100%;
      margin-bottom: 20px;
      &:hover {
        background-color: #333;
      }
    }
  
    .address-container {
      border: 1px solid #ccc;
      padding: 15px;
      margin-bottom: 10px;
      position: relative;
      
      &:hover {
        background-color: #f9f9f9;
      }
  
      .address-details {
        margin-right: 120px; 
      }
  
      .edit-button,
      .delete-button { 
        position: absolute;
        top: 10px;
        width: 50px; 
        right: 70px; 
        border: none;
        background-color: #f1f1f1;
        cursor: pointer;
        padding: 5px 10px; 
        font-size: 12px; 
        &:hover {
          background-color: #e1e1e1;
        }
      }
  
      .delete-button { 
        right: 10px;
        width: 50px; 
      }
    }
  
    .address-form {
      margin-bottom: 20px;
      
  
      button {
        margin-top: 10px;
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
  
  .form-group {
    margin-bottom: 10px;
    label {
      display: block;
      margin-bottom: 5px;
    }
    input, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    textarea {
      height: 6em;
    }

  }
  
  .d-flex {
    display: flex;
  }
  
  .jc-space-between {
    justify-content: space-between;
  }
  
  .existing-addresses {
    .address {
      padding: 10px;
      border: 1px solid #ccc;
      margin-bottom: 10px;
      cursor: pointer;
  
      &-details {
        margin-bottom: 5px;
      }
    }
  }
  
  .form-actions {
    text-align: right;
  }
  
  /* button {
    padding: 10px 15px;
    margin-left: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  } */
  
  button[type="submit"] {
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
  
  button[type="button"] {
    background-color: #f0f0f0;
    display: flex; /* Add this line */
    align-items: center; /* Add this line */
    justify-content: center; /* Add this line */

    border: none; /* Remove border */
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
  
  button:hover[type="submit"] {
    /* opacity: 0.8; */
    background-color: #718f73; /* Green background on hover */
  }

  button:hover[type="button"] {
    /* opacity: 0.8; */
    background-color: #d9d9d9; /* Green background on hover */
  }
   
  .error-message {
    color: red;
  }    
</style>