<template>
  <div class="w-screen h-screen max-w-screen max-h-screen min-w-screen min-h-screen">
    <div class="w-full h-full flex flex-row">
      <Sidebar />
      <div class="flex w-full h-full">
        <slot />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
const logtoClient = useLogtoClient();
const isAuthenticated = useState<boolean | undefined>('is-authenticated');
const accessToken = useState<string | undefined>('access-token');

await callOnce(async () => {
  if (!logtoClient) {
    throw new Error('Logto client is not available');
  }

  isAuthenticated.value = await logtoClient.isAuthenticated();

  if (!isAuthenticated.value)
    return;

  try {
    accessToken.value = await logtoClient.getAccessToken(process.env.LOGTO_BASE_URL + '/api');
  } catch (error) {
    console.error('Failed to get access token', error);
  }
})
</script>