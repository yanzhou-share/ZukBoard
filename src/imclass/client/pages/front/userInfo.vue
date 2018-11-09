</<template>
    <div class="layer_login layer_login2 f-14 txt_color_777 clearfix">
        <ul>
            <li @click="edit"><img src="../../assets/images/ico_user.svg"><span v-text="mobile"></span></li>
            <li @click="logout"><span><img src="../../assets/images/ico_exit.svg">退出登录</span></li>
        </ul> 
    </div>    
</template>
<script>
export default {
  data() {
    return {

    }
  },
  props: ['mobile'],
  methods: {
    logout: () => {
      window.localStorage.clear()
      window.location.href = '/imclass/front/login'
    },
    edit: function () {
      this.$emit('edit')
    }
  }
}
</script>

<style>
.clearfix {
    clear: both;
}
</style>

