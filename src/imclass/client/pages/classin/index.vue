<template>
    <div id="app">
        <!--主内容区域-->
        <Board></Board>

        <!--主内容区域 End-->

        <!--左边导航 Begin-->

        <!--<LeftSideBar></LeftSideBar>-->
        <!--左边导航 End-->

        <!--顶部导航 Begin-->
        <HeadSideBar></HeadSideBar>

        <!--顶部导航 End-->

        <!---video Begin-->
        <VideoContent></VideoContent>
        <!---video end-->
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
  }
}
</script>
