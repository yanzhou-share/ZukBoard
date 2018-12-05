<template>
    <div id="app" class="full-srceen main-classin">
        <!--主内容区域-->
        <Board></Board>

        <!--主内容区域 End-->

        <!--左边导航 Begin-->

        <!--<LeftSideBar></LeftSideBar>-->
        <!--左边导航 End-->

        <!--顶部导航 Begin-->

        <!--<HeadSideBar v-if="getUserType"></HeadSideBar>-->

        <!--顶部导航 End-->

        <!---video Begin-->
        <!--<VideoContent></VideoContent>-->
        <!---video end-->

        <div class="right-content">
            <div class="logo">
                <img src="../../assets/images/logo.png">
            </div>
            <!--<div class="videos">-->
                <!--<div class="pic-item close_off">-->
                    <!--<div class="title ellipsis f-14 txt_color_white">妮娜西蒙斯...</div>-->
                <!--</div>-->
                <!--<div class="pic-item close_off">-->
                    <!--<div class="title ellipsis f-14 txt_color_white">妮娜西蒙斯...</div>-->
                <!--</div>-->
            <!--</div>-->
            <!---video Begin-->
            <VideoContent></VideoContent>
            <!---video end-->
            <!--<div class="tools-btn">-->
                <!--<div class="btn">-->
                    <!--<i class="icons icons-invite"></i>-->
                <!--</div>-->
                <!--<div class="btn">-->
                    <!--<i class="icons icons-live"></i>-->
                <!--</div>-->
                <!--<div class="btn">-->
                    <!--<i class="icons icons-setting"></i>-->
                <!--</div>-->
                <!--<div class="btn last">-->
                    <!--<i class="icons icons-group"></i>-->
                <!--</div>-->
            <!--</div>-->
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
  }
}
</script>
