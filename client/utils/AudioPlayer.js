export default class AudioPlayer {
  constructor() {
    this.isPlaying = false
    this.audioSrc = ''
    this.audioTag = new Audio()
    this.audioTag.volume = 0
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
    const newVol = this.audioTag.volume - 0.05;
    if (newVol >= 0) {
      this.audioTag.volume = newVol;
    }

    if (this.audioTag.volume >= 0.05) {
      this.decreaseTimeout = setTimeout(() => {
        this._decreaseVolume(newSong)
      }, 50);
    }

    else if (newSong) {
      this.audioTag.pause();
      this._doPlay(newSong)
    }
    else {
      this.audioTag.pause();
    }
  }

  _increaseVolume(cb) {
    const newVol = this.audioTag.volume + 0.01;
    if (newVol <= 1) {
      this.audioTag.volume = newVol;
    }
    if (this.audioTag.volume <= 0.25) {
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
    setTimeout(() => {
      this._increaseVolume()
    }, 500)
  }

  _doPause() {
    this.isPlaying = false
    this.audioTag.onended = null;
    _decreaseVolume()
  }

  play(newAudioSrc, cb) {
    if (!this.audioSrc && !newAudioSrc) return new Error('missing audio source :(..')

    if (this.isPlaying) {
      if(this.increaseTimeout) clearTimeout(this.increaseTimeout)
      this._decreaseVolume(newAudioSrc || this.audioSrc)
    }
    else {
      if(this.decreaseTimeout) clearTimeout(this.decreaseTimeout)
      this._doPlay(newAudioSrc || this.audioSrc);
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
