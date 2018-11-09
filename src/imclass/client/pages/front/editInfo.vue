<template>
    <div class="layer_modify cf bg_fff f-14">
        <dl>
        <dt class="txt_color_666">修改姓名</dt>
        <dd><div class="inp"><input name="" v-model="name" class="f-14" type="text"></div></dd>
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
      name: ''
    }
  },
  methods: {
    cancel: function () {

    },
    save: function () {

    }
  }
}
</script>
    