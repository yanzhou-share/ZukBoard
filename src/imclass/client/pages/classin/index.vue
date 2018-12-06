<template>
    <div id="app" class="full-srceen main-classin">
        <!--主内容区域-->
        <Board></Board>

        <div class="right-content">
            <div class="logo">
                <img src="../../assets/images/logo.png">
            </div>

            <VideoContent></VideoContent>

            <HeadSideBar v-if="getUserType"></HeadSideBar>
        </div>

        <router-view/>
    </div>
</template>

<script>
import '../../assets/css/common.css'
import '../../assets/css/template.css'

// import Content from '../../components/classin/Content.vue'

import HeadSideBar from '../../components/classin/HeadSideBar.vue'

// import LeftSideBar from '../../components/classin/LeftSideBar.vue'

import VideoContent from '../../components/classin/VideoContent.vue'

// import Board from '../canvas/draw/components/board'
import Board from '../../../../app/client/pages/canvas/draw/components/board.vue'

export default {
  name: '',
  components: {
    // LeftSideBar,
    // Content,
    Board,
    HeadSideBar,
    VideoContent
  },
  computed: {
    getUserType: function () {
      return !this.$route.query.userType
    }
  },
  created() {
    // const rightWidth = document.querySelector('.right-content').offsetWidth
    // const canvasWidth = window.canvas.width
    // const marginWidth = (document.body.offsetWidth - canvasWidth - rightWidth) / 2 - rightWidth / 2
    // // document.querySelector('.right-content').style.marginRight = marginWidth + 'px'
    // console.warn('-------', rightWidth, canvasWidth, marginWidth)
  },
  mounted() {
    this.$nextTick(() => {
      this.resetMargin()
    })
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.resetMargin()
      }, 500)
    })
  },
  methods: {
    resetMargin() {
      const rightWidth = document.querySelector('.right-content').offsetWidth
      const canvasWidth = window.canvas.width
      const marginWidth = (document.body.offsetWidth - canvasWidth - rightWidth) / 2
      document.querySelector('.right-content').style.marginRight = marginWidth + 'px'
    }
  }
}
</script>
