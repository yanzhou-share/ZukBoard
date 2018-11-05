<template>
  <div class="body-box">
     <!--big_class_login_wrap Begin-->
     <div class="big_class_login_wrap miniclass_login_wrap">
         <!--big_left Begin-->
         <div class="big_left">
           <div class="img"><img src="../../assets/images/left_@2x.png" /></div>
           <div class="tit f-36 txt_color_white">免费4人迷你教室<br>无需注册，随开随用</div>
         </div>
         <!--big_left End-->
         <!--big_form Begin-->
         <div class="big_form">
           <h1 class="f-28 txt_color_666 center"><a href="index.html"><img src="../../assets/images/logo_imclass_mini.svg" /></a></h1>
           <ul class="cf txt_color_b4 f-14">
            <li>
              <div class="num txt_color_blue center"><span>+86<label></label></span></div>
                <div class="inp"><input name="" class="txt_color_666 f-14" v-model="mobile" placeholder="请输入手机号" type="text" maxlength="11"></div>
            </li>
            <li>
                <div v-show="sendAuthCode" class="code txt_color_blue" @click="getCaptcha"><span>获取验证码</span></div>
                <div v-show="!sendAuthCode" class="code txt_color_blue"><span>{{auth_time}} </span><span>s重新发送</span></div>
                <div class="inp"><input name="" class="txt_color_666 f-14" v-model="verifyCode" placeholder="请输入验证码" type="text" maxlength="6"></div>
            </li>
            <li class="bg_none txt_color_666">
              <div class="check_group">
                 <div class="checkbox"><input name="" class="check" type="checkbox" value=""></div>
                  <label>同意并遵守</label>
               </div>
               <a href="privacy.html" class="agreement">《ImClass服务条款》</a>
            </li>
            <li class="btn">
               <input class="f-18 txt_color_aaa" v-bind:class="[ {greenBtn: greenBtnStatus} ]" @click="login" value="登录教室" type="button">
            </li>
           </ul>
         </div>
         <!--big_form End-->
         <div class="big_language f-12"><a href="###" class="on" title="中文" target="_blank">中文</a>/<a href="###" title="EN" target="_blank">EN</a></div>
     </div>
     <!--big_class_login_wrap End-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      verifyCode: '',
      mobile: '111',
      sendAuthCode: true,
      auth_time: 60
    }
  },
  computed: {
    greenBtnStatus: function () {
      return (this.mobile.length > 0) && (this.verifyCode.length === 6)
    }
  },
  methods: {
    login: function () {
      this.$http.post('/api/httpForward', {
        url: 'http://devmini.imclass.cn:80/majorserverm/user/loginUser',
        params: { mobile: this.mobile, code: '', userType: '1' }
      }).then(res => {
        const { code, data } = res.data.data
        const { userToken } = data.userInfo
        if (code) {
          console.log(userToken)
        }
      }, err => {
        console.log(err)
      })
    },
    getCaptcha: function () {
      this.$http.post('/api/httpForward', {
        url: 'http://devmini.imclass.cn:80/majorserverm/user/sendPhoneCode',
        params: { mobile: this.mobile }
      }).then(res => {
        const { code, data } = res.data.data
        console.log(code, data)
        if (code !== '0') {
          this.sendAuthCode = false
          var authTimetimer = setInterval(() => {
            this.auth_time--
            if (this.auth_time <= 0) {
              this.sendAuthCode = true
              clearInterval(authTimetimer)
            }
          }, 1000)
        } else {
          alert('发送验证码失败')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.miniclass_login_wrap .big_form ul li.btn input.greenBtn {
  color: white;
  background: #D95043;
}
</style>
