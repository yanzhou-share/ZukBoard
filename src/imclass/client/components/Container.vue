<template>
  <div class="app-container">
    <div class="main">
      <div class="app-content bg01">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-container'
}
</script>

<style>
.main,.app-container, .app-content{
  height: 100%;
}
</style>
