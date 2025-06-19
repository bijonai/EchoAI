<template>
  <client-only>
    <span class="w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-200 transition-all duration-100"
      @click="navigateTo(`/auth/${user ? 'signout' : 'signin'}`, { external: true })">
      <template v-if="isAuthenticated">
        <img class="h-6 rounded-full" :src="user.picture || `https://www.gravatar.com/avatar/${avatarHash}`"
          :alt="user.email || '用户头像'" />
      </template>
      <template v-else>
        <Icon name="humbleicons:user" class="!w-5 !h-5" />
      </template>
    </span>
  </client-only>
</template>

<script setup lang="ts">
import { useLogtoUser, navigateTo } from '#imports';
import { ref, onMounted } from 'vue';
import md5 from 'crypto-js/md5';

const isAuthenticated = useState<boolean | undefined>('is-authenticated');
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