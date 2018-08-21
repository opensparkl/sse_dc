<!--
  Copyright 2018 SPARKL Limited

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  An input field for audio/binary data, used in the Unit Test Modal.
-->
<template>
  <div class="unit-test-input input-binary-field">
    <flex-spread>
      <div slot="left" style="padding: 4px 6px;">
        {{title || 'Please select a file...'}}
      </div>
      <div slot="right">
        <input ref="file"
               type="file"
               style="display: none;"
               @change="onFileInputChange">
        <button class="modal-input-button"
                @click="openUploadDialog">
          <i class="fa fa-upload"/>
        </button>
        <button :class="recordingButtonClass"
                @click="toggleRecording">
          <i class="fa fa-microphone"/>
        </button>
      </div>
    </flex-spread>
  </div>
</template>

<script>
import base64 from '@/util/base64'

export default {
  name: 'InputBinaryField',
  props: {
    field: {
      type: Object
    }
  },
  data () {
    return {
      title: '',
      value: null,
      recording: false
    }
  },
  computed: {
    recordingButtonClass () {
      return {
        'modal-input-button record-button': true,
        'record-button-active': this.recording
      }
    }
  },
  methods: {
    clean () {
      this.title = ''
      this.value = null
    },

    stopAudioRecording () {
      clearInterval(this.timer)
      this.recording = false
      this.recorder.stop()
    },

    startAudioRecording () {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false
        })
        .then((stream) => {
          const chunks = []
          const recorder = new MediaRecorder(stream, {
            mimeType: 'video/webm'
          })

          let duration = 0
          this.title = 'Recording: ' + duration + ' seconds'

          this.recorder = recorder
          this.recording = true

          this.timer = setInterval(() => {
            duration++
            this.title = 'Recording: ' + (duration / 10).toFixed(2) + ' seconds'
          }, 100)

          recorder.addEventListener('start', e => {
            this.recording = true
          })

          recorder.addEventListener('dataavailable', e => {
            if (e.data.size > 0) {
              chunks.push(e.data)
            }
          })

          recorder.addEventListener('stop', () => {
            var file = new Blob(chunks)

            this.fileToBase64(file, (base64) => {
              this.value = base64
              this.title = 'Audio Record.'

              this.$emit('change', {
                title: this.title,
                value: this.value
              })

              stream.getTracks()[0].stop()
            })
          })

          recorder.start()
        })
    },

    toggleRecording () {
      this.recording
        ? this.stopAudioRecording()
        : this.startAudioRecording()
    },

    fileToBase64 (file, callback) {
      let reader = new FileReader()

      if (file) {
        reader.onload = (event) => {
          let buffer = reader.result
          let value = base64.fromArrayBuffer(buffer)

          callback(value)
        }

        reader.readAsArrayBuffer(file)
      }
    },

    onFileInputChange (event) {
      this.clean()

      let file = event.target.files[0]

      this.fileToBase64(file, (base64String) => {
        this.title = file.name
        this.value = base64String

        this.$emit('change', {
          title: this.title,
          value: this.value
        })
      })
    },

    openUploadDialog () {
      this.$refs.file.click()
    }
  }
}
</script>

<style lang="scss">
.input-binary-field {
  position: relative;
  font-size: 11px;
  padding: 0;
}

.record-button {
  position: relative;

  i {
    position: relative;
    z-index: 2;
  }

  &.record-button-active {
    color: rgba(255,255,255,0.9);

    &:before {
      display: block;
      position: absolute;
      content: '';
      background: #EE5332;
      border-radius: 50%;

      top: 5px;
      left: 7px;

      width: 15px;
      height: 15px;

      z-index: 0;
    }
  }
}
</style>
