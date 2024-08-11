
<template>
  <div class="order-history">
    <div class="header">
      <h1 class="order-history-heading">Order History</h1>
      <div class="sort-and-search">
        <b-dropdown id="dropdown-1" text="Sort By" class="m-md-2 custom-dropdown">
          <b-dropdown-item class="custom-dropdown-item" @click="sortByTime">Sort by Time</b-dropdown-item>
          <!-- <b-dropdown-item class="custom-dropdown-item" @click="sortByPrice">Sort by Price</b-dropdown-item> -->
        </b-dropdown>
      </div>
    </div>

    <div class="orders-container">
      <div v-for="order in sortedOrders" :key="order._id" class="order">
        <div>Order ID: {{ order._id }}</div>
        <div>Seller ID: {{ order.seller_id }}</div>
        <div>Product ID: {{ order.product_id }}</div>
        <div>Date: {{ new Date(order.modified_at ?? '').toLocaleString('en-US') }}</div>
        <div>Status: {{ order.order_status }}</div>
        <!-- <button @click="viewDetails(order._id)">View Details</button> -->
        <button class="detail-button" @click="goToDetail(order._id)">Go to Detail</button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { getOrdersApi } from '../api/accountApiService';

export interface Order {
  _id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  modified_at: Date;
  created_at: Date;
  order_status: string;
}

const orders = ref<Order[]>([]);
const sortedOrders = ref<Order[]>([]);

const router = useRouter();
const toast = useToast();


const fetchOrders = async () => {
  try {
    console.log('Fetching orders...');
    const response = await getOrdersApi();
    orders.value = response.orders;
    sortByTime();
  } catch (error) {
    toast.error('Failed to get order history: ' + error);
  }
};

onMounted(fetchOrders);


const sortByTime = () => {
    // Sort products by price
    sortedOrders.value = [...orders.value].sort((a, b) => {
      const dateA = new Date(a.modified_at ?? '');
      const dateB = new Date(b.modified_at ?? '');
      return +dateB - +dateA; // sort in descending order
    });
  };


const goToDetail = (orderId: string) => {
  // todo 
  router.push(`/orders/${orderId}`);
};

</script>


<style scoped>
.order-history {
  font-family: 'Arial', sans-serif;
  margin: auto;
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

.orders {
  padding: 1rem;
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

  button:hover {
    background-color: #4cae4c; /* A darker shade of 'success' color */
  }
}


@media (max-width: 481px) {
  .header {
    height: 60px;
    display:flex;
    align-items: end;
    justify-content: space-between;
    padding: 0.5rem; /* 减少头部的内边距 */
  }

  .order-history-heading {
    margin-top:1px;
    font-size: 1.5rem; /* 增大标题字体大小 */
    text-align: left;
    white-space: nowrap;
    /* flex-grow: 1;  */
  }

  .sort-and-search {
    font-size: 15px;
    /* width: 100%;  */
    margin-top: 0.5rem; /* 增加顶部间距 */
  }

  .orders-container .order {
    padding: 10px; /* 减小订单元素的内边距 */
    margin-bottom: 8px; /* 减小订单元素之间的间距 */
  }

  .detail-button {
    padding: 4px 8px; /* 调整按钮的内边距使其更易点击 */
    font-size: 10px; /* 减小按钮字体大小以适应更小的显示区域 */
  }
}


</style>