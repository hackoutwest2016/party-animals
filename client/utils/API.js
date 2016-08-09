import AudioPlayer from './AudioPlayer';
import Speecher from './Speecher';
import { Recognizer } from "../utils/recognizer";

window.API = {
  speecher: new Speecher(),
  audioPlayer: new AudioPlayer(),
  recognizer: new Recognizer(),
}

export const API = window.API;
