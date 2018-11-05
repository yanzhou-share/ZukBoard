import ToastComponent from './toast.vue'
const Toast = {}

Toast.install = function (Vue) {
  const ToastConstructor = Vue.extend(ToastComponent)
  const instance = new ToastConstructor()
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  Vue.prototype.$toast = (msg, duration = 5000) => {
    instance.msg = msg
    instance.theToast = true
    setTimeout(() => {
      instance.theToast = false
    }, duration)
  }
}

export default Toast
