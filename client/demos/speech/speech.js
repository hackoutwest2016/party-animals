import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './speech.html';

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition  || null;

Template.speech.onCreated(() => {
  this.status = new ReactiveVar('Stopped');
  this.transcription = new ReactiveVar('');

  this.recognizer = new SpeechRecognition();
  this.recognizer.interimResults = true;
  this.recognizer.continuous = true;
  this.recognizer.onresult = (event) => {
    this.transcription.set(event.results[0][0].transcript)
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