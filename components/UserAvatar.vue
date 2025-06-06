<template>
  <client-only>
    <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      @click="navigateTo(`/auth/${user ? 'signout' : 'signin'}`, { external: true })">
      <template v-if="user">
        <img class="h-6 rounded-full" :src="user.picture || `https://www.gravatar.com/avatar/${avatarHash}`"
          :alt="user.email || '用户头像'" />
      </template>
      <template v-else>
        <Icon name="heroicons:user-circle" class="w-10 h-10 text-gray-400" />
      </template>
    </button>
  </client-only>
</template>

<script setup lang="ts">
import { useLogtoUser, navigateTo } from '#imports';
import { ref, onMounted } from 'vue';
import md5 from 'crypto-js/md5';

const user = useLogtoUser();
const avatarHash = ref('');

onMounted(() => {
  if (user?.email) {
    avatarHash.value = md5(user.email).toString();
  } else {
    avatarHash.value = '';
  }
});
</script>