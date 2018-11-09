<template>
    <div class="layer_modify cf bg_fff f-14">
        <dl>
        <dt class="txt_color_666">修改姓名</dt>
        <dd><div class="inp"><input name="" v-model="userName" class="f-14" type="text" maxlength="11"></div></dd>
        <dd class="f-right">
        <input name="" class="f-14 txt_color_777" value="取消" @click="cancel" type="reset">
        <input name="" class="f-14 txt_color_d9" value="保存" @click="save" type="button">
        </dd>
        </dl>
    </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  props: ['userName'],
  methods: {
    cancel: function () {
      this.$emit('hide')
    },
    save: function () {
      const userInfo = window.localStorage.getItem('userInfo')
      const info = JSON.parse(userInfo)
      info.mobile = userName
      this.$emit('hide')
    }
  }
}
</script>
    