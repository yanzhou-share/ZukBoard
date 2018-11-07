<template>
<div class="body-box">
   <!--big_class_login_wrap Begin-->
   <div class="miniclass_setup_wrap">
         <h1><a href="index.html"><img src="../../assets/images/setup_logo_imclass_mini.svg" /></a></h1>
         <ul class="cf f-20 txt_color_666 f-14">
          <li>
            <dl class="text v-m-c">
             <dd class="f-b">开始一节新的课程</dd>
             <dt class="txt_color_d9 f-b" @click="createLesson">创建教室</dt>
            </dl>
          </li>
          <li>
            <dl class="text v-m-c">
             <dd class="f-b">加入一间教室</dd>
             <dd class="f-16">
              <span>www.imclass.cn/</span>
              <div class="inp"><input name="" v-model="roomId" placeholder="输入6位房间号" class="f-16 txt_color_999" type="text" maxlength="6"></div>
            </dd>
             <dt class="txt_color_d9 f-b" @click="joinRoom">加入教室</dt>
            </dl>
          </li>
         </ul>
   </div>
   <!--big_class_login_wrap End-->
   <!--miniclass_setup_member Begin-->
   <div class="miniclass_setup_member">
     <div class="mem_ico"><img src="../../assets/images/images.svg" /></div>
   </div>
   <!--miniclass_setup_member End-->
</div>
</template>
<script>
export default {
  data() {
    return {
      roomId: ''
    }
  },
  methods: {
    createLesson: function () {
      this.$http.post('/api/httpForward', {
        url: 'http://devmini.imclass.cn:80/majorserverm/room/createRoom',
        params: {}
      }).then(res => {
        const { code, data } = res.data.data
        if (code === '0') {
          window.location.href = '/imclass/classin/' + data.roomInfo.roomNumber
        } else if (code === '3001') {
          this.$toast('房间创建失败')
        }
      }, err => {
        console.error(err)
        this.$toast('手机号或验证码不正确')
      })
    },
    joinRoom: function () {
      if (!this.roomId || this.roomId.length < 6) {
        this.$toast('请输入6位有效的房间号')
      }
      this.$http.post('/api/httpForward', {
        url: 'http://devmini.imclass.cn:80/majorserverm/room/jionRoom',
        params: { roomNumber: this.roomId, userType: 1 }
      }).then(res => {
        const { code } = res.data.data
        if (code === '0') {
          const roomInfo = JSON.stringify(res.data.data.data.roomInfo)
          window.sessionStorage.setItem('roomInfo', roomInfo)
          window.location.href = '/imclass/classin/' + this.roomId
        } else if (code === '') {
          this.$toast('房间已关闭')
        } else if (code === '3002') {
          this.$toast('房间不存在')
        } else if (code === '3003') {
          this.$toast('房间已经满了')
        }
      })
    }
  }
}
</script>
