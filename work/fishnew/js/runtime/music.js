let instance; // 单例化

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if (instance) return instance;

    instance = this;

    this.playing = false;
    this.bgmAudio = document.createElement('audio');
    this.bgmAudio.loop = true;
    this.bgmAudio.src = "/audio/back.mp3";

    this.btnAudio = document.createElement('audio');
    this.btnAudio.src = "/audio/btn.mp3";

    this.successAudio = document.createElement('audio');
    this.successAudio.src = "/audio/success.mp3";

    this.isCanPlay = window.localStorage.getItem("music-play") !== 'false';
    // console.log("是否可以播放音乐：", this.isCanPlay);

    if (this.isCanPlay) {
      this.playBgm();
    }
  }

  playBgm() {
    if (!this.isCanPlay) return;
    this.bgmAudio.play();
    this.playing = true;
  }

  pauseBgm() {
    this.bgmAudio.pause();
    this.playing = false;
  }

  stopBgm() {
    this.bgmAudio.currentTime = 0;
    this.bgmAudio.pause();
  }

  triggerBgm() {
    if (this.isCanPlay) {
      this.isCanPlay = false;
      this.pauseBgm();
      window.localStorage.setItem("music-play", false);
      
    } else {
      this.isCanPlay = true;
      this.playBgm();
      window.localStorage.setItem("music-play", true);
    }
  }

  playBtn() {
    if (!this.isCanPlay) return;
    this.btnAudio.pause();
    this.btnAudio.currentTime = 0;
    this.btnAudio.play();
  }

  playSuccess() {
    if (!this.isCanPlay) return;
    this.successAudio.currentTime = 0;
    this.successAudio.play();
  }

  isPlaying() {
    return this.playing;
  }

  getCanPlay() {
    return this.isCanPlay;
  }
}
