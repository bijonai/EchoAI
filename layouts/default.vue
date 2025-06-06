<template>
  <div class="w-screen h-screen max-w-screen max-h-screen min-w-screen min-h-screen">
    <div class="w-full h-full flex flex-row">
      <Sidebar />
      <div class="flex p-1 w-full h-full">
        <slot />
      </div>
    </div>
  </div>
</template>