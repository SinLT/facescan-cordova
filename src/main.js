import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

const getSettings = () => {
  try {
    if (facedetection) {
      new Vue({
        render: h => h(App),
      }).$mount('#app')  
    }
  } catch (error) {
    setTimeout(() => {
      getSettings()
    }, 200)
  }
}

getSettings()
