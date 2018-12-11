<template>
  <div class="full-srceen">
    <div class="screen-content">
      <div id="canvas" ref="canvas" style="margin: 0 auto;background: #ffffff;" class="canvas-container">
        <canvas id="layer-draw"></canvas>
      </div>
      <div class="image-loading" v-show="isUploading">
        <span class="icons-loading"></span>
        <span class="loading-text">上传中...</span>
      </div>

      <!--工具条 begin-->
      <div class="wb-toolbar" v-show="getUserType === 1 ? true : false" @click.stop>
        <div class="tool-item cf"  v-for="(plugin, key) in plugins"
             :key="plugin.name"
             @click="choose(key)">
          <!-- <span class="tool-note">移动</span> -->
          <i :class="[{'on': plugin.active},plugin.class]"></i>
          <template v-if="plugin.hasAction">
            <component
                    v-show="plugin.showAction"
                    :config="plugin"
                    @change-current="choose"
                    class="plugin-tools-item-action"
                    @click.stop
                    :is="key + '-action'" >
            </component>
          </template>
        </div>

        <div class="tool-item cf" @click="(e) => {deleteSelected(e)}" title="删除">
          <i class="icons icons-eliminate" :class="{'del': !canDelete}"></i>
        </div>

        <!--<div class="tool-item cf" @click="(e) => {eraserAction(e)}" title="删除">-->
          <!--<i class="icons icons-eliminate"></i>-->
        <!--</div>-->

        <!--<div class="tools props" style="margin-top: -60px;">-->
          <!--<template v-for="(item, key) in plugins"  v-if="item.active">-->
            <!--<component-->
                    <!--:ref="key"-->
                    <!--v-show="item.active"-->
                    <!--:config="item.setting"-->
                    <!--:isShow="item.active"-->
                    <!--:is="key"-->
                    <!--:key="key">-->
            <!--</component>-->
          <!--</template>-->
        <!--</div>-->
      </div>
      <!--工具条 END -->
    </div>



    <!--左边导航 Begin-->
    <!--<aside class="toolbar middle" v-show="role ? false : true" @click.stop>-->
      <!--<div class="toolbar-inner">-->
        <!--<div class="btn-tool cf">-->
          <!--&lt;!&ndash;<div class="tool-item cf">&ndash;&gt;-->
            <!--&lt;!&ndash;<span class="tool-note">移动</span>&ndash;&gt;-->
            <!--&lt;!&ndash;<i class="icons icons-move"></i>&ndash;&gt;-->
          <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--<div class="tool-item cf"-->
               <!--v-for="(plugin, key) in plugins"-->
               <!--:key="plugin.name"-->
               <!--@click="choose(key)"-->
            <!--&gt;-->
            <!--<span class="tool-note">{{plugin.title}}</span>-->
            <!--<i :class="[{'on': plugin.active},plugin.class]"></i>-->
            <!--<template v-if="plugin.hasAction">-->
              <!--<component-->
                      <!--v-show="plugin.showAction"-->
                      <!--:config="plugin"-->
                      <!--@change-current="choose"-->
                      <!--class="plugin-tools-item-action"-->
                      <!--@click.stop-->
                      <!--:is="key + '-action'" >-->
              <!--</component>-->
            <!--</template>-->
          <!--</div>-->

          <!--<div class="tool-item cf" @click="(e) => {deleteSelected(e)}" title="删除">-->
            <!--<span class="tool-note">清除</span>-->
            <!--<i class="icons icons-eliminate" :class="{'del': !canDelete}"></i>-->
          <!--</div>-->

        <!--</div>-->

      <!--</div>-->

    <!--</aside>-->
    <!--左边导航 End-->

    <!--鼠标右键 Begin-->

    <!--鼠标右键 End-->

  </div>

</template>

<script>
import socket from '../plugins/socket.js'
import uuid from 'uuid'
import Draw from '../draw.js'
import {} from '../plugins/events.js'
import plugins from '../plugins/setting.js'
import { settings, actions } from '../plugins'
import SyncStatusNotify from './SyncStatusNotify'
import { eventEmitter } from '../plugins/util'

export default {
  data() {
    Object.keys(plugins).forEach(key => {
      plugins[key].active = key === 'choose'
      plugins[key].hasAction = !!actions[key + 'Action']
      plugins[key].showAction = false
    })
    return {
      board: {
        _id: uuid.v4(),
        name: '',
        roomId: ''
      },
      canDelete: false,
      contextMenu: {
        show: false,
        x: 0,
        y: 0
      },
      zindex: 0,
      wPercent: 1,
      hPercent: 1,
      baseWidth: 1600,
      baseHeight: 1200,
      uid: '', // temp uid
      renderList: [],
      redoList: [],
      canRedo: true,
      socket,
      current: {
        type: '',
        data: {}
      },
      plugins,
      setting: {
        kbText: {
          color: '#333'
        }
      },
      drawer: {},
      isLoading: true,
      pIndex: 6,
      steps: [10, 15, 20, 33, 50, 75, 100, 125, 150],
      role: null,
      userType: 1,
      isUploading: false,
      roomId: undefined
    }
  },
  watch: {
    'drawer.zoomPercent': function (val) {
      if (!val) val = 1
      this.drawer.setZoom(val)
    }
  },
  computed: {
    zoomPercent: {
      get: function (val) {
        return (this.drawer.zoomPercent * 100).toFixed(0) + '%'
      }
    },
    notPresenter: {
      get: function () {
        return this.drawer.isFollowingMode && !this.drawer.isPresenter
      }
    },
    getCanvasWh: {
      get: function () {
        this.drawer.canvasHeight = document.body.offsetHeight <= document.body.offsetWidth ? document.body.offsetHeight : document.body.offsetWidth * 3 / 4
        this.drawer.canvaswidth = document.body.offsetWidth >= document.body.offsetHeight ? document.body.offsetHeight * 4 / 3 : document.body.offsetWidth
        return this.drawer
      }
    },
    getUserType: {
      get: function () {
        this.userType = this.$route.query.userType || 1
        return this.userType
      }
    }
  },
  components: {
    SyncStatusNotify,
    ...settings,
    ...actions
  },
  created() {
    this.roomId = this.$route.params.id
    this.role = this.$route.query.role
    this.registerSocket()
    if (this.roomId) {
      // this.test(id)
      this.socket.emit('joinRoom', this.roomId)
      this.getBoard(this.roomId)
      return
    }
    this.createBoard()
  },
  mounted() {
    this.$nextTick(() => {
      // console.warn('width:' + document.body.offsetWidth, 'height:' + document.body.offsetHeight)
      // const canvasHeight = document.body.offsetHeight
      // const canvasWidth = document.body.offsetHeight * 4 / 3
      this.drawer = new Draw(this, '#canvas', this.getCanvasWh.canvaswidth, this.getCanvasWh.canvasHeight, this.roomId)
      this.drawer.init()
      window.drawer = this.drawer
      this.toggleFollowing()
      this.resetMargin()
    })
    document.body.addEventListener('click', () => {
      this.contextMenu.show = false
      if (this.plugins['uploadImg'].active) {
        this.choose('choose')
      }
    })
    document.oncontextmenu = (ev) => {
      this.contextMenu.x = this.mouseX(ev)
      this.contextMenu.y = this.mouseY(ev)
      this.contextMenu.show = true
      return false // 屏蔽右键菜单
    }
    this.$refs.canvas.oncontextmenu = () => {
      return false
    }
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 8 || e.keyCode === 46) {
        this.deleteSelected()
      }
    })
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.resetMargin()
      }, 500)
    })
    eventEmitter.addListener('toggleLoading', (flag) => {
      this.isUploading = flag
    })
  },
  methods: {
    onZoomChange(value) {
      const percent = +value.substring(0, value.length - 1)
      this.drawer.zoomPercent = percent / 100
    },

    resetMargin() {
      const rightContent = document.querySelector('.right-content')
      if (!rightContent) return
      const rightWidth = rightContent.offsetWidth
      const canvasWidth = window.canvas.width
      const marginWidth = (document.body.offsetWidth - canvasWidth - rightWidth) / 2
      document.querySelector('.screen-content').style.marginLeft = marginWidth + 'px'
      // console.warn('-------', rightWidth, canvasWidth, marginWidth)
    },
    registerSocket() {
      this.socket.on('sync', (type, item) => {
        if (type === 'move_by_presenter') {
          this.focusPresenter(item.data)
          this.drawer.resizeCanvas()
          return
        }
        if (type === 'zoom') {
          this.drawer.presenterZoom = item.data.zoom
          this.drawer.resizeCanvas()
          this.focusPresenter()
          return
        }

        // if (this.drawer.isFollowingMode) {
        // this.drawer.resizeCanvas()
        // this.focusPresenter()
        // }

        if (type === 'undo') {
          this.undo(item.opId)
          return
        }
        if (type === 'redo') {
          this.redo(item.opId)
          return
        }

        if (type === 'zoom') {
          this.drawer.presenterZoom = item.data.zoom
          this.drawer.resizeCanvas()
          // this.drawer.setZoom(item.data.zoom * 1)
          return
        }
        if (type !== 'move') {
          this.renderList.push(item)
        }
        console.log(item)
        this.drawer.syncBoard(type, item)
      })
      this.socket.on('startFollow', (opt) => {
        this.initFollower(opt)
      })
      this.socket.on('endFollow', (opt) => {
        this.drawer.isPresenter = false
        this.drawer.isFollowingMode = false
        this.drawer.presenterZoom = 1
        this.drawer.setZoom(1)
      })

      this.socket.on('clear', (r) => {
        this.drawer.clear()
        this.renderList = []
        this.redoList = []
        this.$message({
          type: 'info',
          message: '画布已被清空!'
        })
      })
    },
    initFollower(opt) {
      this.drawer.isPresenter = true
      this.drawer.isFollowingMode = true
      this.drawer.presenterZoom = opt.zoom
      // this.drawer.baseWidth = opt.width
      this.drawer.baseWidth = this.baseWidth
      this.drawer.baseHeight = this.baseHeight
      this.choose('brush')
      this.drawer.resizeCanvas()
      this.focusPresenter(opt.pan)
    },
    toggleFollowing() {
      const { container } = this.drawer
      // alert(JSON.stringify(this.drawer.getLastVpPoint()))
      // console.warn('----', this.drawer.getLastVpPoint(), this.drawer.getVpPoint())
      const opt = {
        width: container.offsetWidth,
        height: container.offsetHeight,
        zoom: this.drawer.zoomPercent,
        pan: {
          ...this.drawer.getLastVpPoint()
        }
      }
      this.initFollower(opt)
    },
    changeZoom(isUp) {
      let filterArr = this.steps.filter((item) => {
        return isUp ? this.drawer.zoomPercent * 100 < item : this.drawer.zoomPercent * 100 > item
      })
      if (filterArr.length === 0) return
      this.pIndex = isUp ? this.steps.indexOf(filterArr[0]) - 1 : this.steps.indexOf(filterArr[filterArr.length - 1]) + 1
      if ((isUp && (this.pIndex === this.steps.length - 1)) || (!isUp && (this.pIndex === 0))) return
      if (isUp) {
        this.pIndex++
      } else {
        this.pIndex--
      }
      this.drawer.zoomPercent = this.steps[this.pIndex] / 100
      if (this.drawer.isPresenter) {
        this.socket.emit('sync', 'zoom', {
          data: {
            zoom: this.drawer.zoomPercent
          }
        }, this.board._id, this.board._id)
      }
    },
    focusPresenter(point) {
      if (!point) {
        point = this.drawer.presenterPan
      } else {
        this.drawer.presenterPan = point
      }
      if (point) {
        this.drawer.moveToPoint(point.x, point.y, point.width, point.height)
      }
    },
    createBoard() {
      this.$http.post('/api/board/create').then(res => {
        const { code, msg, data } = res.data
        if (code !== 0) {
          this.$message.error(msg)
        }
        this.renderList = Object.assign([], data.canvas)
        this.initBoard()
        delete data.canvas
        this.board = data
        this.socket.emit('joinRoom', data._id)
        window.history.replaceState({}, '', `/app/canvas/draw/${data._id}`)
      })
    },
    saveBoard() {
      this.$http.post('/api/board/save', {
        id: this.board._id,
        canvas: this.renderList
      }).then(res => {

      })
    },
    getBoard(id) {
      this.$http.get('/api/board/get', {
        params: {
          id: id
        }
      }).then(res => {
        const { code, data } = res.data
        if (code !== 0 || !data) {
          this.createBoard()
        }
        this.renderList = Object.assign([], data.canvas)
        this.$nextTick(() => {
          this.initBoard()
        })
        delete data.canvas
        this.board = data
      })
    },
    test(id) {
      this.$http.post('/api/httpForward', {
        url: 'https://dev.hoozha.com:8999/server/ip', params: { id: id }
      }).then(res => {
        const { code, data } = res.data
        console.log(code, data)
      })
    },
    initBoard() {
      this.drawer.initBoard(this.renderList)
    },
    getQueryString(name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let r = location.search.substr(1).match(reg)
      if (r != null) return unescape(decodeURI(r[2]))
      return null
    },
    sync(key, type, data, noPush) {
      let item = {
        uid: this.uid,
        key,
        data,
        type,
        id: Array.isArray(data) ? data : data.id,
        opId: this.genKey(),
        time: new Date().getTime()
      }
      if (!noPush) {
        this.renderList.push(item)
      }
      // this.socket.emit('sync', type, item, this.board._id, this.board._id)
      this.socket.emit('sync', type, item, this.board.roomId, this.board.roomId)
    },
    toggleAction(item, flag) {
      item.showAction = flag
    },
    refresh() {
      this.$confirm('点击确定，画板将会永久清空', '确认清空画板？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.drawer.clear()
        this.renderList = []
        this.redoList = []
        this.socket.emit('clear', this.board._id)
        this.$message({
          type: 'info',
          message: '画布已被清空!'
        })
      })
    },
    redo(opid) {
      if (this.redoList.length === 0) return
      if (typeof opid !== 'string') opid = undefined
      let index = -1
      if (opid) {
        index = this.redoList.findIndex(e => e.opId === opid)
      }
      const item = opid ? this.redoList.splice(index, 1)[0] : this.redoList.pop()
      if (!item) return
      this.renderList.push(item)
      this.$nextTick(() => {
        this.drawer.clear()
        this.initBoard()
      })

      !opid && this.socket.emit('sync', 'redo', item, this.board._id, this.board._id)
    },
    undo(opid) {
      if (typeof opid !== 'string') opid = undefined
      if (this.renderList.length === 0) return
      let index = -1
      if (opid) {
        index = this.renderList.findIndex(e => e.opId === opid)
      }
      const item = opid ? this.renderList.splice(index, 1)[0] : this.renderList.pop()
      console.log(item)
      if (!item) return
      this.redoList.push(item)
      this.$nextTick(() => {
        this.drawer.clear()
        this.initBoard()
      })
      !opid && this.socket.emit('sync', 'undo', item, this.board._id, this.board._id)
    },
    deleteSelected() {
      this.drawer.deleteSelected()
    },
    eraserAction() {
      this.drawer.eraser()
    },
    choose(chooseKey, hiddenAction) {
      if (!this.plugins[chooseKey].useInFollowing && this.notPresenter) {
        // return
      }
      if (chooseKey === 'brush' && this.drawer.current === 'brush') {
        this.$refs.brush && this.$refs.brush[0].updateAction()
      }
      this.drawer.setKey(chooseKey)
      Object.keys(this.plugins).forEach(key => {
        this.plugins[key].active = key === chooseKey
      })
      if (chooseKey === 'uploadImg') {
        eventEmitter.emit('uploadBtnClick')
        return false
      }
      if (!hiddenAction) {
        this.toggleAction(this.plugins[chooseKey], !this.plugins[chooseKey].showAction)
      }

      if (chooseKey === 'uploadImg') {
        eventEmitter.emit('uploadBtnClick')
      }
    },
    beforeCloseTab() {
      window.onbeforeunload = function (e) {
        let message = ''
        e = e || window.event

        if (e) {
          e.returnValue = message
        }

        return message
      }
    },
    mouseX(evt) {
      if (evt.pageX) {
        return evt.pageX
      } else if (evt.clientX) {
        return evt.clientX + (document.documentElement.scrollLeft
          ? document.documentElement.scrollLeft
          : document.body.scrollLeft)
      } else {
        return null
      }
    },
    genKey() {
      return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10)
    },
    mouseY(evt) {
      if (evt.pageY) {
        return evt.pageY
      } else if (evt.clientY) {
        return evt.clientY + (document.documentElement.scrollTop
          ? document.documentElement.scrollTop
          : document.body.scrollTop)
      } else {
        return null
      }
    },
    hideLoading() {
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
  .middle{
    top: 50%;
    margin-top: -130px;
  }
</style>
