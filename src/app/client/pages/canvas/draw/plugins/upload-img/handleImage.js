import { genKey, eventEmitter, LoadImageAsync } from '../util'
import { fabric } from 'fabric'
const SYNC_TYPE = {
  INSERT: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  MOVE: 'move',
  REDO: 'redo',
  UNDO: 'undo',
  MOVE_BY_PRESENTER: 'move_by_presenter'
}
class HandleImage {
  constructor(canvas) {
    this.globalCanvas = canvas
    this.registerEvents()
  }
  registerEvents() {
    eventEmitter.addListener('on-should-draw-img', (ev) => {
      this.addImage(ev)
    })
  }
  addImage(url) {
    const that = this
    const canvas = this.globalCanvas.layerDraw
    const vpt = canvas.viewportTransform.slice(0)
    LoadImageAsync(url).then((attr) => {
      let scale = 1
      let left = 0
      let top = 150
      if (attr.width >= that.globalCanvas.canvaswidth / 2) {
        scale = (that.globalCanvas.canvaswidth / (2 * attr.width)).toFixed(1)
      }
      const zoom = canvas.getZoom()
      left = (that.globalCanvas.canvaswidth - attr.width * zoom * scale) / 2 - vpt[4]
      top -= vpt[5]
      fabric.Image.fromURL(url, (upImg) => {
        const img = upImg.set({ left: left / zoom, top: top / zoom }).scale(scale)
        img.set('id', genKey())
        img.set('btype', this.globalCanvas.current)
        canvas.add(img)
        this.globalCanvas.klassSetting(false)
        this.globalCanvas._vm.sync('uploadImg', SYNC_TYPE.INSERT, img.toJSON(['id', 'btype']))
        eventEmitter.emitEvent('toggleLoading', false)
      }, { crossOrigin: 'anonymous' })
    })
  }
  log() {

  }
}
export default HandleImage
