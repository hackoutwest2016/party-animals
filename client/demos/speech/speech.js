import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SongAnswerMode } from "../../modes/song-answer";
import './speech.html';

//new SongAnswerMode().start();

import AudioPlayer from "../../utils/AudioPlayer";


let a = new AudioPlayer();

a.play('https://p.scdn.co/mp3-preview/a2a9c13416fc981d035e75f16ec63b0d8e6486ba')


setTimeout(() => {
  console.log('asjkdaskjdhaksjd')
  a.play('https://p.scdn.co/mp3-preview/1ee9f1b0c3e3b327dd49ebc6dd64266b01adb96a')
}, 5000);


setTimeout(() => {
  console.log('asjkdaskjdhaksjd')
  a.pause()
}, 7000);

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition  || null;

Template.speech.onCreated(function speechOnCreated() {

  this.status = new ReactiveVar('Stopped');
  this.transcription = new ReactiveVar('');

  this.recognizer = new SpeechRecognition();
  this.recognizer.interimResults = true;
  this.recognizer.continuous = true;
  this.recognizer.onresult = (event) => {
    const whatWasSaid = event.results[0][0].transcript;
    console.debug("Someone said", whatWasSaid);
    this.transcription.set(whatWasSaid);
    onUserInput(whatWasSaid);
  }
});

Template.speech.helpers({
  status() {
    return Template.instance().status.get();
  },
  transcription() {
    return Template.instance().transcription.get();
  },
});

Template.speech.events({
  'click [data-speech-listen]'(event, instance) {
    instance.recognizer.start();
  },
  'click [data-voice-stop]'(event, instance) {
    instance.status.set('Canceled');
    instance.recognizer.stop();
  },
});

