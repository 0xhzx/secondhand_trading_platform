<template>
<div class="change-password-container">
    <h2>Change Password</h2>
    <form @submit.prevent="changePassword">

      <div class="form-group">
        <label for="currentPassword">Current Password</label>
        <input type="password" id="currentPassword" v-model="profile.currentPassword" required>
        <p>You must enter your current password to update your profile.</p>
      </div>

      <div class="form-group">
        <label for="newPassword">New Password</label>
        <input type="password" id="newPassword" v-model="profile.newPassword" required>
      </div>
      
      <div class="form-group">
        <label for="confirmNewPassword">Confirm New Password</label>
        <input type="password" id="confirmNewPassword" v-model="profile.confirmNewPassword" required>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="cancel">Cancel</button>
        <button type="submit">Save Changes</button>
      </div>
    </form>
  </div>
  
</template>

 <script setup lang="ts">
  import { ref, onMounted, pushScopeId } from 'vue';
  import { useRouter } from 'vue-router';
  import { useToast } from "vue-toastification";
  import { updateUserProfile, fetchUserId, updateUserPassword } from '../api/accountApiService.ts';

  const toast = useToast();

  const router = useRouter();

  // 定义用户资料类型
  type UserProfileType = {
    newPassword: string;
    confirmNewPassword: string;
    currentPassword: string;
  };

  const profile = ref<UserProfileType>({
    newPassword: '',
    confirmNewPassword: '',
    currentPassword: ''
  });

  async function changePassword() {
    if (profile.value.newPassword !== profile.value.confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const idResponse = await fetchUserId();
      const userId = idResponse.user_id;

      await updateUserPassword(userId, profile.value.newPassword, profile.value.confirmNewPassword, profile.value.currentPassword);
      toast.success('Successfully updated password!');
      console.log('Successfully updated user password');
      router.push('/account');
    } catch (error) {
      toast.error('Failed to update user password: ' + error);
      console.error('Failed to fetch public data:', error);
    }
  }

  const cancel = () => {
    // 重置表单或导航到其他页面
    router.push('/account'); 
  };
</script>
    

<style scoped>
.change-password-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
}

.form-group input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-actions {
  text-align: right;
}

button {
  padding: 10px 15px;
  margin-left: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #5cb85c;
  color: white;
}

button[type="button"] {
  background-color: #f0f0f0;
}

button:hover {
  opacity: 0.8;
}
</style>