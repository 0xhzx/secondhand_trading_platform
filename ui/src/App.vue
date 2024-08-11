<template>

  <!-- Header Component -->
  <header class="site-header"></header>
  <div class="header">
    <div class="header-logo" @click="goToHome">404 ONLINE Trading Stores</div>
    <!-- <div class="header-search">
      <input type="text" class="search-input" placeholder="Search for products..." aria-label="Search"/>
    </div> -->
    <div class="header-icons">
      <!-- <span class="icon-cart" >🛒</span> -->
      <!-- <span class="icon-seller" @click="gotoLogin">My Listings </span> -->
      <img src="./static/account.svg" class="icon-user" @click="goToAccount" alt="Account" />
    </div>
  </div>

  <router-view />
  
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, inject, Ref } from 'vue'

const router = useRouter();
const user = inject("user") as Ref<any>

onMounted(async () => {
  console.log("Checking login status")
  if (!user.value.user_id) {
    console.log("User is not logged in")
    user.value = await (await fetch("/api/users/check-login")).json()
  }
  console.log("i'm here with check login done", user.value)

  if (!user.value.user_id) {
    console.log("User is not logged in")

    // if (router.currentRoute.value.path === '/some/thing/needing/you/logged/in') {
    //   router.push('/login');
    // }
  } else {
    console.log("User is logged in")
  }
})

const goToHome = () => {
      router.push('/');
  };


const goToAccount = () => {
      router.push('/account');
  };

const gotoLogin = () => {
      router.push('/login');
};


</script>


<style scoped>

.site-header {
  background-color: #0b0b0b;
  border-bottom: 1px solid #0f0e0e;
  padding: 15px 0;
  margin-bottom: 20px;
  height: 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}


.header {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 将子元素平均分布在容器的两端 */
  padding: 10px 20px; /* Adjust the padding as needed */
  background-color: #fff; /* Or any color you want */
  
  margin-bottom: 10px;
}

.header-logo {
  /* flex-grow: 1; */
  margin-left: 3vw;
  cursor: pointer;
  font-size: 24px; /* Adjust the size as needed */
  font-weight: bold; /* Adjust the weight as needed */
}

.header-search {
  flex-grow: 2; /* 允许搜索栏增长以填满多余的空间 */
  display: flex;
  justify-content: center; /* 将搜索输入居中 */

  .search-input {
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 5px 10px;
    margin-left: 10px; /* 和 logo 之间的距离 */
  }
}

.header-icons {
  margin-right: 3%;
  display: flex; /* 用于对齐图标 */
}

.header-icons .icon-cart,
.header-icons .icon-user {
  cursor: pointer;
  margin-left: 10px;
}

.header-icons .icon-seller {
  cursor: pointer;
  margin-left: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc; /* Adjust the border as needed */
  border-radius: 5px; /* Adjust the border radius as needed */
  background-color: #f3f3f3; /* Adjust the background color as needed */
}


@media (max-width: 480px) {
  .header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    /* align-items: flex-start; */
  }

  .header-logo {
    margin-left: 0;
    font-size: 18px;
  }

  .header-icons {
    margin-right: 0;
    margin-top: 0px;
  }

  .header-search {
    width: 100%;
    margin-top: 10px;

    .search-input {
      width: 100%;
      margin-left: 0;
    }
  }


}

</style>