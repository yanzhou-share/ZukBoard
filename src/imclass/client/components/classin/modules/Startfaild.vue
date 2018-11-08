<template>
    <div>
        <div class="layer_02 f-16 txt_color_white midStyle" v-show="isShow">
            <h2 class="f-20">开启直播<div class="close" @click="closed"></div></h2>
            <div class="con center cf">
                <p><img src="../../../assets/images/ico_failt.svg">启动失败</p>
                <div class="btn"><a href="javascript:void(0);" class="layer_btn f-20" @click="reloadAction">重新开启</a><a href="javascript:void(0);" class="layer_btn2 f-20" @click="closed">取消</a></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true,
      loadingShow: false
    }
  },
  components: {

  },
  computed: {

  },
  methods: {
    closed() {
      this.isShow = false
      this.$emit('closeFilad', {})
    },
    reloadAction() {
      this.isShow = false
      this.$emit('reloadAction', {})
    }
  },
  mounted() {
    // todo
  }
}
</script>

<style scoped>
    .midStyle{
        position: absolute;
        z-index: 103;
        top: 50%;
        left: 50%;
        margin-left: -211px;
        margin-top: -122px;
    }
</style>
