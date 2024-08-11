<template>
    <div class="account-profile">

      <aside class="sidebar">
        <ul>
          <!-- <li @click="selectComponent('UserProfile')">Your Profile</li> -->
          <li @click="selectComponent('UserOrders')">Order History</li>
          <li @click="selectComponent('UserListings')">My Listings</li>
          <li @click="logout">Sign Out</li>
          <form method="POST" action="/api/users/logout" id="logoutForm" />
        </ul>
      </aside>

      <section class="order-history">
        <component :is="currentComponent"></component>
      </section>
    </div>
  </template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Component } from 'vue';
import UserOrders from './UserOrders.vue';
import UserListings from './UserListings.vue';

const router = useRouter();

const isSidebarOpen = ref(false); // 用于控制侧边栏状态的响应式变量

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value; // 切换侧边栏状态
};

const components: Record<string, Component> = {
  // UserProfile,
  UserOrders,
  UserListings,
};

const currentComponent = ref<Component>(UserOrders); // default component

const selectComponent = (componentName: string) => {
  currentComponent.value = components[componentName];
};

const logout = async () => {
  ;(window.document.getElementById('logoutForm') as HTMLFormElement).submit()  

  // await logoutApi();
  // router.push('/')
  // console.log(res)
  // if (true) {
    // console.log("redirecting to", res.url)
    // window.location.href = "'http://127.0.0.1:8082/'"  
  // }
};

</script>


<style scoped>

.account-profile {
  display: flex;
  background: #f9f9f9;
  padding: 20px;
}

.sidebar {
  flex-basis: 200px; /* Adjust width of the sidebar as needed */
  padding: 20px;

}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex; /* 设置为flex布局 */
  flex-direction: column; /* 默认为垂直排列 */
  width: 100%; /* 确保占满整个容器宽度 */
}

.sidebar li {
  padding: 10px 0;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.sidebar li:hover {
  color: #000; /* Color change on hover */
}

.order-history {
  flex: 1; /* Takes the remaining space */
  padding: 15px;
  background: #fff;
  margin-left: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 移动设备适配 */
@media (max-width: 481px) {

  .account-profile {
    flex-direction: column;
  }
  .sidebar {
    /* width: 40px; */
    padding:5px;
    display:flex;
    flex-basis: 20px;
    flex-direction: row;
    margin-bottom: 10px;
  }
  .sidebar ul {
    flex-direction: row; /* 在小屏幕上改为水平排列 */
    justify-content: space-between; /* 列表项之间平均分配空间 */
  }

  .sidebar li {
    flex: 1; /* 每个列表项占据平等的空间 */
    padding: 5px 10px; /* 调整内边距以适应小屏幕 */
    text-align: center; /* 文本居中显示 */
  }

  .order-history {
    padding: 5px;
  }
}

</style>