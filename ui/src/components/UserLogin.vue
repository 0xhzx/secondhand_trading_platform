<template>
    <div class="login-container">
      <h1>Welcome to Our Store!</h1>
      <button @click="loginWithOIDC">Log in with Gitlab</button>
    </div>
</template>



<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function loginWithOIDC() {
  window.location.href = '/api/users/login';
  // router.push('/api/users/login');
}
</script>


<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>