import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './voice.html';

const CONFIG = {
  lang:"en_US",
  lang2:"en-US",
  pitch: 2,
  rate: 0.85
}

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition  || null;

Template.voice.onCreated(function voiceOnCreated() {
  this.status = new ReactiveVar('Stopped');
});

Template.voice.helpers({
  status() {
    return Template.instance().status.get();
  },
});

Template.voice.events({
  'click [data-voice-speak]'(event, instance) {
    let selectedVoice = speechSynthesis
          .getVoices()
          .filter(function(voice) {
            console.log(voice)
             return (voice.lang === CONFIG.lang || voice.lang === CONFIG.lang2);
          })
          .pop();

    let utterance = new SpeechSynthesisUtterance();

        utterance.text = instance.find('[data-voice-input]').value;
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        utterance.rate = CONFIG.rate;
        utterance.pitch = CONFIG.pitch;

        utterance.addEventListener('start', () => {
          instance.status.set('Speaking');
        });
        utterance.addEventListener('end', () => {
          instance.status.set('Stopped');
        });

        speechSynthesis.speak(utterance);

  },
  'click [data-voice-stop]'(event, instance) {
    instance.status.set('Canceled');
    speechSynthesis.cancel();
  },
  'click [data-voice-pause]'(event, instance) {
    instance.status.set('Paused');
    speechSynthesis.pause();
  },
  'click [data-voice-resume]'(event, instance) {
    instance.status.set('Speaking');
    speechSynthesis.resume();
  },
});