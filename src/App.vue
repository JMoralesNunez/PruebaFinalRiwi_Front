<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<style>
body {
  background-color: #f8f9fa;
}
.app-container {
  min-height: 100vh;
}
</style>