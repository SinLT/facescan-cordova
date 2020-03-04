<template>
  <div>
    <div class="scan">
      <div class="top">
        <div class="topLeft"></div>
        <div class="topRight"></div>
      </div>
      <div class="bottom">
        <div class="bottomLeft"></div>
        <div class="bottomRight"></div>
      </div>
      <!-- 人脸扫描窗口 -->
      <div class="face-container">
        <video id="video"
               width="348"
               height="348"
               autoplay></video>
        <canvas id="faceCanvas"
                width="358"
                height="358"
                v-show="faceShow"></canvas>
        <canvas id="faceImage"
                width="60"
                height="60"
                v-show="false"></canvas>
        <canvas id="faceImage2"
                width="358"
                height="358"
                v-show="false"></canvas>
      </div>
      <div class="line"
           v-show="lineShow"></div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      faceShow: false,
      lineShow: false,
      timer: null,
      faces: null,
      mediaStreamTrack: null,
      flag: true
    }
  },
  mounted () {
    const that = this
    // Initializing vars & consts
    const video = document.querySelector('video')
    const canvas = document.querySelector('#faceCanvas')
    const context = canvas.getContext('2d')
    const canvas2 = document.querySelector('#faceImage')
    const context2 = canvas2.getContext('2d')
    const canvas3 = document.querySelector('#faceImage2')
    const context3 = canvas3.getContext('2d')

    // Get access to the camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          that.mediaStreamTrack = stream.getTracks()[0]
          video.srcObject = stream
          video.play()
          facedetection.initFaceDetection(
            15,
            '../assets/facefinder',
            function (result) {
              console.log(result)
              detect()
            }
          )
        })
        .catch(function (err) {
          console.error(err)
          that.$message('没有识别到摄像头')
        })
    }

    async function detect () {
      try {
        // context.drawImage(video, 0, 0, canvas.width, canvas.height)
        context.clearRect(0, 0, canvas.width, canvas.height)
        context2.drawImage(video, 0, 0, canvas2.width, canvas2.height)
        context3.drawImage(video, 0, 0, canvas3.width, canvas3.height)
        const rgba = context2.getImageData(0, 0, canvas2.width, canvas2.height)
          .data
        facedetection.detections(
          rgba,
          canvas2.width,
          canvas2.height,
          canvas2.width * 0.2,
          canvas2.height * 1.2,
          0.1,
          function (dets) {
            let greaterFace, box
            greaterFace = Math.max.apply(
              Math,
              dets.map(function (o) {
                return o[2]
              })
            )
            if (dets.length === 0) {
              that.faceShow = false
            }
            for (let i = 0; i < dets.length; ++i) {
              box = dets[i]
              console.log(box)
              if (box[2] != greaterFace || box[3] === undefined) {
                continue
              }
              // that.lineShow = true
              that.faceShow = true
              const y = box[0] * 6
              const x = box[1] * 6
              const s = box[2] * 6
              context.strokeStyle = 'red'
              context.lineWidth = 4
              context.strokeRect(x - s / 2, y - s / 1.6, s, s + 50)
              // context3.clearRect(0, 0, canvas3.width, top - 30)
              // context3.clearRect(
              //   0,
              //   top + height + 30,
              //   canvas3.width,
              //   canvas3.height
              // )
              // context3.clearRect(0, 0, left - 15, canvas3.height)
              // context3.clearRect(
              //   left + width + 15,
              //   0,
              //   canvas3.width - left - width - 15,
              //   canvas3.height
              // )
            }
          }
        )
      } catch (error) {
        console.error(error)
      }
      setTimeout(() => {
        detect()
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
#video {
  object-fit: fill;
}
#video,
#faceCanvas,
#faceImage {
  transform: rotateY(180deg);
}
.scan {
  width: 360px;
  height: 360px;
  border: 1px solid rgba(106, 222, 255, 1);
  position: relative;
  .top {
    display: flex;
    justify-content: space-between;
    .topLeft {
      width: 40px;
      height: 40px;
      border-top: 5px solid rgba(106, 222, 255, 1);
      border-left: 5px solid rgba(106, 222, 255, 1);
    }
    .topRight {
      width: 40px;
      height: 40px;
      border-top: 5px solid rgba(106, 222, 255, 1);
      border-right: 5px solid rgba(106, 222, 255, 1);
    }
    &::after {
      content: '';
      position: absolute;
      right: -109px;
      bottom: 0;
      width: 1px;
      height: 100%;
      background: rgba(255, 255, 255, 0.6);
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 278px;
    .bottomLeft {
      width: 40px;
      height: 40px;
      border-bottom: 5px solid rgba(106, 222, 255, 1);
      border-left: 5px solid rgba(106, 222, 255, 1);
    }
    .bottomRight {
      width: 40px;
      height: 40px;
      border-bottom: 5px solid rgba(106, 222, 255, 1);
      border-right: 5px solid rgba(106, 222, 255, 1);
    }
  }
  .face-container {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 348px;
    height: 348px;
    transform: translate(-50%, -50%);
    #faceCanvas {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  .line {
    position: absolute;
    width: 100%;
    border-top: 5px solid #6adeff;
    z-index: 2;
    /*动画效果*/
    animation: myScan 1s infinite alternate;
  }
}
@keyframes myScan {
  from {
    top: 5px;
  }
  to {
    top: 350px;
  }
}
</style>
