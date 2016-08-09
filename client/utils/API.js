import AudioPlayer from './AudioPlayer'
import Speecher from './Speecher'

window.API = {
  speecher: new Speecher(),
  audioPlayer: new AudioPlayer()
}