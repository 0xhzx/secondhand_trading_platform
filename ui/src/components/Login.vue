
<template>
<div class="signup-container">
  <div class="greeting">Welcome back !!!</div>
    <form @submit.prevent="submitForm">
      <h2>Sign In</h2>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>
  
      <div class="form-actions">
        <button type="submit">  SIGN IN  </button>
        <p>I Don't have an account? <a href="/register">Sign up</a></p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue';
import { useToast } from "vue-toastification";
import { registerAccount, loginAccount, login } from '../api/accountApiService.ts';

const toast = useToast();
const router = useRouter();
const email = ref('');
const password = ref('');

async function submitForm() {
  
  try {

    const data = await loginAccount(email.value, password.value);
    // const userExample = await fetchUserExample();
    // if (userExample != null) {
    //   console.log('userExample: ', userExample);
    // }else{
    //   console.log('userExample is null');
    // }

    localStorage.setItem('access_token', data.access_token);

    console.log('successfully logged in, user: ', data.firstname);
    toast.success('Login successful, ' + data.firstname);
    // wait for 1 second before redirecting to home page
    setTimeout(() => {
      router.push('/');
    }, 1000);
  } catch (error) {
    console.error('login failed: ', error);
    toast.error('Login failed. Please try again later.');  
  }
}

</script>



<style scoped>
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

.greeting {
  color:#2f372cc4;
  margin-bottom: 20px; /* 这将在欢迎语和表单之间添加 20px 的空间 */
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