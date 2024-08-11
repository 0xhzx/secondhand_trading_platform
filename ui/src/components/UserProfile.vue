<template>
  <div class="user-profile">
    <form @submit.prevent="updateProfile">
      <h2>Edit Profile</h2>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="profile.email" required>
      </div>
      
      <div class="form-group">
        <label for="firstname">First Name</label>
        <input type="text" id="firstname" v-model="profile.firstname" required>
      </div>
      
      <div class="form-group">
        <label for="lastname">Last Name</label>
        <input type="text" id="lastname" v-model="profile.lastname" required>
      </div>
      
      <button type="submit">Update Profile</button>
    </form>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, pushScopeId } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
import { updateUserProfile, fetchUserId } from '../api/accountApiService.ts';

const toast = useToast();

const router = useRouter();

// 定义用户资料类型
type UserProfileType = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
};

// 用于存储用户资料的响应式数据
const profile = ref<UserProfileType>({
  id: 0, // ID 会在组件加载时从后端获取
  email: '',
  firstname: '',
  lastname: '',
  password: ''
});

// 封装加载用户配置文件的逻辑
async function fetchUserProfile(userId: any) {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return response.json();
}

// 在组件加载时执行
onMounted(async () => {
  try {
    const data = await fetchUserId();
    const userId = data.user_id;
    console.log('User ID:', userId);
    const userData = await fetchUserProfile(userId);
    profile.value = userData;
    console.log('User profile loaded:', profile.value);
  } catch (error) {
    console.error(error);
    router.push('/login'); 
  }
});

// update user profile
const updateProfile = async () => {
  try {
    await updateUserProfile(profile.value.id, profile.value.email, profile.value.firstname, profile.value.lastname);  
    toast.success('Successfully updated profile!');
    console.log('Successfully updated user profile');
    router.push('/account');
  } catch (error) {
    toast.error('Failed to update user profile: ' + error);
    console.error('Failed to fetch public data:', error);
  } 
};

</script>

<style scoped>
/* 添加 CSS 样式 */
.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
}

input[type="email"],
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background-color: #4cae4c;
}
</style>