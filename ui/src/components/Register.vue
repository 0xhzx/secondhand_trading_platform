
<template>

  <div class="signup-container">
    <form @submit.prevent="registerUser">
      <h2>Sign Up</h2>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="form-group">
        <label for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" v-model="confirmPassword" required>
      </div>
      <div class="form-group">
        <label for="first-name">First Name</label>
        <input type="text" id="first-name" v-model="firstName" required>
      </div>
      <div class="form-group">
        <label for="last-name">Last Name</label>
        <input type="text" id="last-name" v-model="lastName" required>
      </div>
      <div class="form-actions">
        <button type="submit">  SIGN UP  </button>
        <p>Have an account? <a href="/login">Sign in</a></p>
      </div>
    </form>
  </div>
</template>



<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from "vue-toastification";
import { registerAccount } from '../api/accountApiService.ts';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const firstName = ref('');
const lastName = ref('');

const toast = useToast();
const router = useRouter();



const registerUser = async () => {
  try {
    const data = await registerAccount(email.value, password.value, firstName.value, lastName.value);
    console.log('registered successfully, user id: ', data.id);
    toast.success("registered successfully, user id: " + data.id);
    setTimeout(() => {
      router.push('/login');
    }, 1000);
    // 解析 JSON 响应体
    // // 在这里处理注册成功的逻辑，比如显示成功消息、跳转到登录页面等
  } catch (error) {
    toast.error('Failed to register: ' + error);
  }
};
</script>


<style scoped>
/* Add more styles as needed */
.signup-container {
  max-width: 400px;

  margin: auto;
  margin-top: 2%;
  padding: 1em;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  font-family: Popins, sans-serif;
}

h2 {
  text-align: center;
}

.form-group {
  margin-bottom: 1em;
}

label {
  display: block;
  margin-bottom: 0.5em;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.form-actions {
  text-align: center;
}

button {
  padding: 0.5em 1em;
  background: #333;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

button:hover {
  background: #555;
}

p {
  margin-top: 1em;
}

a {
  color: #333;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>