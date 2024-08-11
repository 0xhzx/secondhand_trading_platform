<template>
  <div class="order-detail">
    <div class="header">
      <h1>Order Detail</h1>
    </div>

    <div class="detail-content">
      <div class="product-image" v-if="productDetail">
        <img :src="productDetail.image_url" alt="Product Image">
      </div>

      <div class="info-content">
        <div class="order-info">
          <h2>Order Information</h2>
          <div>Order ID: {{ orderDetail._id }}</div>
          <div>Buyer ID: {{ orderDetail.buyer_id }}</div>
          <div>Seller ID: {{ orderDetail.seller_id }}</div>
					<div>Seller Name: {{ seller_name }}</div>
          <div id="productID">Product ID: {{ orderDetail.product_id }}</div>
          <div>Date: {{ new Date(orderDetail.modified_at ?? '').toLocaleString('en-US') }}</div>
          <div>Status: {{ orderDetail.order_status }}</div>
        </div>

        <div class="product-info" v-if="productDetail">
          <h2>Product Information</h2>
          <div>Product Name: {{ productDetail.product_name }}</div>
          <div>Price: ${{ productDetail.price }}</div>
          <div>Seller ID: {{ productDetail.seller_id }}</div>
					<div>Seller Name: {{ seller_name }}</div>
          <div>Description: {{ productDetail.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

  <script setup lang="ts">
  import { ref, onMounted, inject, Ref } from 'vue';
  import { useRouter } from 'vue-router';
	import {getOrderDetailApi} from '../api/accountApiService';
	import {useToast} from 'vue-toastification';
	import { productType } from './Products.vue';
  import {fetchProductById, fetchUsernameWithProduct} from '../api/productApiService';


  
  interface OrderDetail {
    _id: string;
    buyer_id: string;
    seller_id: string;
    product_id: string;
    modified_at: string;
    order_status: string;
  }
  
  const router = useRouter();
	const toast = useToast();
	const productDetail = ref<productType | null>(null);
	const seller_name = ref('');	
  const orderDetail = ref<OrderDetail>({
    _id: '',
    buyer_id: '',
    seller_id: '',
    product_id: '',
    modified_at: '',
    order_status: '',
  });

	async function getProductDetail() {
		const productId = orderDetail.value.product_id;

		try {
			const res = await await fetchProductById(productId.toString());
			productDetail.value = res.product;
		} catch (error) {
			console.error('Failed to get product detail:', error);
		}
	}
  
  async function getOrderDetail() {
    const orderId = router.currentRoute.value.params.id;
  
    try {
      const response = await getOrderDetailApi(orderId.toString());
			orderDetail.value = response.data;

			if(orderDetail == null || orderDetail.value == null){
				console.log('Failed to get order detail');
				return
			}
    } catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      const match = /HTTP status: (\d+)/.exec(message);
      if (match) {
        const statusCode = parseInt(match[1], 10);
        if (statusCode === 403) {
          toast.error('No permission. You are not the owner of this order.');
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          toast.error('Failed to get order detail: ' + error);
        }
      }
    }
  }
  }
  
  onMounted(async () => {
    await getOrderDetail();
		await getProductDetail();
		const sellerName = await fetchUsernameWithProduct(orderDetail.value.seller_id);
		seller_name.value = sellerName.name;
  });
  </script>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
}

.header {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  color: #333;
  font-size: 2rem;
  text-align: center; /* Center the text */
}

.detail-content {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.product-image {
  flex: 1;
  border-radius: 5px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 75%;
  object-fit: contain;
}

.info-content {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-info, .product-info {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-info h2, .product-info h2 {
  text-align: center;
  color: #333;
  font-size: 1.5rem;
}

.order-info div, .product-info div {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 0.5rem;
}


@media (max-width: 480px) {
  .detail-content {
    flex-direction: column; /* 切换为垂直布局 */
  }

  .product-image, .info-content {
    /* flex: none;  */
    width: 90%; /* 使图片和信息内容宽度充满容器 */
  }

  .product-image img {

    margin-left:114px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 50%; /* 调整图片高度自适应 */
  }

  .order-info, .product-info {
    margin-left: 36px;
    width: 90%;
    padding: 0.5rem; /* 减少内边距 */
    /* margin: 1rem auto;  */
  }

  .order-info h2, .product-info h2 {
    font-size: 1.2rem; /* 减小标题字体大小以适应小屏幕 */
  }

  .order-info div, .product-info div {
    font-size: 1rem; /* 减小文本字体大小以提高可读性 */
  }
}

</style>