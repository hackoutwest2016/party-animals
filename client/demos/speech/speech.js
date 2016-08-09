import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SongAnswerMode } from "../../modes/song-answer";
import './speech.html';

new SongAnswerMode().start();

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

