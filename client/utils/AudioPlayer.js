export default class AudioPlayer {
  constructor() {
    this.isPlaying = false
    this.audioSrc = ''
    this.audioTag = new Audio()
    this.currentTime = 0
    this.decreaseTimeout = this.increaseTimeout = false;

    this._decreaseVolume = this._decreaseVolume.bind(this)
    this._increaseVolume = this._increaseVolume.bind(this)
    this._doPlay = this._doPlay.bind(this)
    this._doPause = this._doPause.bind(this)

    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
  }

  _decreaseVolume(newSong) {
    this.audioTag.volume -= 0.05
    if (this.audioTag.volume >= 0.05) {
      this.decreaseTimeout = setTimeout(() => {
        this._decreaseVolume(newSong)
      }, 50);
    }

    else if (newSong) {
      this._doPlay(newSong)
      this._increaseVolume()
    }
  }

  _increaseVolume(cb) {
    this.audioTag.volume += 0.01;
    if (this.audioTag.volume <= 0.95) {
      this.increaseTimeout = setTimeout(() => {
        this._increaseVolume(cb)
      }, 50);
    }
    else if (cb) {
      cb.call(this);
    }
  }

  _doPlay(newAudioSrc) {
    this.audioTag.src = newAudioSrc || this.audioSrc;
    this.isPlaying = true
    this.audioTag.play();
  }

  _doPause() {
    this.isPlaying = false
    this.audioTag.onended = null;
    this.audioTag.pause();
  }

  play(newAudioSrc, cb) {
    if (!this.audioSrc && !newAudioSrc) return new Error('missing audio source :(..')

    if (this.isPlaying) {
      if(this.increaseTimeout) cancelTimeout(this.increaseTimeout)
      this._decreaseVolume(newAudioSrc || this.audioSrc)
    }
    else {
      if(this.decreaseTimeout) cancelTimeout(this.decreaseTimeout)
      this._doPlay(newAudioSrc || this.audioSrc);
      this._increaseVolume()
    }

    this.audioTag.onended = cb;
  }

  pause() {
    if(this.isPlaying) {
      this.isPlaying = false
      this._decreaseVolume()
    }
  }
}