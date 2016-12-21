<template>
  <div>
    <button :disabled="isRecording" v-on:click="record">Start</button>
    <button :disabled="isPausing" v-on:click="pause">{{pauseText}}</button>
    <button :disabled="isStopping" v-on:click="stop">Stop</button>
    <div>{{errorMessage}}</div>
    <a :href="videoLink ? videoLink : null" v-if="videoReady" v-bind:download="fileName" v-bind:fileName="fileName" >Download Video</a>
  </div>
</template>


<script>
const DESKTOP_MEDIA = ['screen'];
export default {
  data () {
    return {
        isRecording: false,
        isStopping: true,
        isPausing: true,
        pauseText: "Pause",
        errorMessage: "Error Message Placeholder",
        pending_request_id: null,
        mux_stream: new MediaStream(),
        mediaRecorder: null,
        chunks: [],
        count: 0,
        videoReady: false,
        videoLink: null, 
        fileName: null
    }
  },
  mounted () {
      this.record();
  },
  methods: {
        record: function(event) {
            //open testing site
            chrome.windows.create({'url': 'http://example.com', 'type': 'normal'}, function (window) {
                //get current window and update properties
                chrome.windows.getCurrent(function (window) {
                    chrome.windows.update(window.id, { 
                        width: 300, 
                        height: 200,
                        left: screen.width - 300
                    });
                });    
            });
            console.log('start recording clicked');
            if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
                alert('MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead.');
            } else {
                //ask for desktop permissions
                this.pending_request_id = chrome.desktopCapture.chooseDesktopMedia(
                    DESKTOP_MEDIA, this.onAccessApproved);
                this.isRecording = true;
                this.isStopping = false;
                this.isPausing = false;
            }
        },
        pause: function(event) {
            if (this.pauseText === "Pause") {
                console.log('recording paused');
                this.pauseText = "Resume";
                this.mediaRecorder.pause();
                this.isStopping = true;
            } else {
                console.log('recording resumed');
                this.pauseText = "Pause";
                this.mediaRecorder.resume();
                this.isStopping = false;
            }
            this.isRecording = true;
            this.isPausing = false;
        },
        stop: function(event) {
            console.log('recording stopped');
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.isPausing = true;
            this.isStopping = true;
        },
        onAccessApproved: function onAccessApproved(id) {
            //hack to solve callback referance
            var that = this;
            if (!id) {
                console.log('Access rejected.');
                return;
            }
            navigator.mediaDevices.enumerateDevices().then(function(deviceInfos) {
                for (var i = 0; i !== deviceInfos.length; ++i) {
                    var deviceInfo = deviceInfos[i];
                    
                    if (deviceInfo.kind === 'audioinput') {
                        console.log("audio device id " + deviceInfo.deviceId);

                        navigator.mediaDevices.getUserMedia({
                            audio: { deviceId: deviceInfo.deviceId }
                        }).
                        then(that.handleSuccess).catch(that.handleError);
                        break;
                    }
                }
            }).catch(that.handleError);
            
            //record screen 
            navigator.mediaDevices.getUserMedia({
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: id,
                        maxWidth: screen.width,
                        maxHeight: screen.height
                    }
                }
            }).then(that.handleSuccess).catch(that.handleError);
        },
        handleSuccess: function(stream) {
            console.log(stream);
            stream.oninactive = function() {
                console.log('Stream inactive');
            };
            this.mux_stream.addTrack(stream.getTracks()[0]);
            if (this.mux_stream.getTracks().length == 2) {
                console.log('start recording call');
                this.startRecording(this.mux_stream);
            }
        },
        handleError: function(error) {
            if (error.name === 'ConstraintNotSatisfiedError') {
                this.errorMessage = 'The resolution ' + constraints.video.width.exact + 'x' +
                    constraints.video.width.exact + ' px is not supported by your device.';
            } else if (error.name === 'PermissionDeniedError') {
                this.errorMessage = 'Permissions have not been granted to use your camera and ' +
                    'microphone, you need to allow the page access to your devices in ' +
                    'order for the demo to work.';
            }
            this.errorMessage = 'getUserMedia error: ' + error.name, error
            console.log(error);
        },
        startRecording: function(stream) {
            var that = this;
            console.log('Media recordering..');
            if (typeof MediaRecorder.isTypeSupported == 'function') {
                /*
                  MediaRecorder.isTypeSupported is a function announced in https://developers.google.com/web/updates/2016/01/mediarecorder and later introduced in the MediaRecorder API spec http://www.w3.org/TR/mediastream-recording/
                */
                if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
                    var options = { mimeType: 'video/webm;codecs=h264' };
                } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                    var options = { mimeType: 'video/webm;codecs=vp9' };
                } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
                    var options = { mimeType: 'video/webm;codecs=vp8' };
                }
                console.log('Using ' + options.mimeType);
                this.mediaRecorder = new MediaRecorder(stream, options);
            } else {
                console.log('Using default codecs for browser');
                this.mediaRecorder = new MediaRecorder(stream);
            }

            this.pauseText = "Pause";

            this.mediaRecorder.start(10);

            this.mediaRecorder.ondataavailable = function(e) {
                //log('Data available...');
                //console.log(e.data);
                //console.log(e.data.type);
                //console.log(e);
                that.chunks.push(e.data);
            };

            this.mediaRecorder.onerror = function(e) {
                console.log('Error: ' + e);
                console.log('Error: ', e);
            };


            this.mediaRecorder.onstart = function() {
                console.log('Started & state = ' + that.mediaRecorder.state);
            };

            this.mediaRecorder.onstop = function() {
                console.log('Stopped  & state = ' + that.mediaRecorder.state);

                var blob = new Blob(that.chunks, { type: "video/webm" });
                that.chunks = [];
                var videoURL = window.URL.createObjectURL(blob);

                that.videoReady = true;
                that.videoLink = videoURL;
                var rand = Math.floor((Math.random() * 10000000));
                var name = "video_" + rand + ".webm";
                that.fileName = name;
            };

            this.mediaRecorder.onpause = function() {
                console.log('Paused & state = ' + that.mediaRecorder.state);
            }

            this.mediaRecorder.onresume = function() {
                console.log('Resumed  & state = ' + that.mediaRecorder.state);
            }

            this.mediaRecorder.onwarning = function(e) {
                console.log('Warning: ' + e);
            };  
        }
    }
}
</script>