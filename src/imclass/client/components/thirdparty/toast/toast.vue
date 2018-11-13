<template>
  <div>
    <div class="layer_error txt_color_white f-16 center bg_3c" v-show="theToast">{{msg}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      theToast: false,
      msg: ''
    }
  }
}
</script>
<style lang="scss">
.bg_3c.center {
  position: absolute;
  left: 50%;
  top: 0;
  margin-left: -130px;
  z-index: 105;
}
.layer_error {
  border-radius: 8px;
  width: 260px;
  padding: 15px 10px;
}
</style>
