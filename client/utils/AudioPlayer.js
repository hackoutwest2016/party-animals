export default class AudioPlayer {
  constructor() {
    this.isPlaying = false
    this.audioSrc = ''
    this.audioTag = new Audio()
    this.audioTag.loop = true
    this.audioTag.volume = 0


    this._decreaseVolume = this._decreaseVolume.bind(this)
    this._increaseVolume = this._increaseVolume.bind(this)
    this._doPlay = this._doPlay.bind(this)
    this._doPause = this._doPause.bind(this)

    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
  }

  _decreaseVolume(cb) {
    this.audioTag.volume -= 0.01;
    if (this.audioTag.volume >= 0.95) {
      setTimeout(() => {
        this._decreaseVolume(cb)
      }, 100);
    }
    else {
      if (cb) cb.call(this);
    }
  }

  _increaseVolume(cb) {
    console.log(this.audioTag.volume)
    this.audioTag.volume += 0.01;
    if (this.audioTag.volume <= 0.95) {
      setTimeout(() => {
        this._increaseVolume(cb)
      }, 50);
    }
    else {
      if (cb) cb.call(this);
    }
  }

  _doPlay() {
    this.isPlaying = true
    this.audioTag.play();
  }

  _doPause() {
    this.isPlaying = false
    this.audioTag.pause();
  }

  play(newAudioSrc) {
    if (!this.audioSrc && !newAudioSrc) return new Error('missing audio source :(..')

    this.audioTag.src = newAudioSrc || this.audioSrc;

    if (this.isPlaying) {
      this._decreaseVolume(this._doPlay)
    }
    else {
      this._doPlay();
      this._increaseVolume()
    }
  }

  pause() {
    if(this.isPlaying) {
      this._decreaseVolume(this._doPause)
    }
  }
}