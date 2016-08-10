import { getWhatToSay } from "../piximals/piximal-sentences" ;
import { Session } from "meteor/session";
import { Games } from "../../both/collections/Games";
import { Logs } from "../../both/collections/Logs";

export default class Speecher {
  constructor(voices = ["en-US", "en_US"], pitch = 2, rate = 0.8) {
    this.setConfig({
      voices: voices,
      pitch: pitch,
      rate: rate,
    })

    this.log = Session.get('logs') || []

    this.say = this.say.bind(this)
  }

  setConfig(config) {
    if(!config.voices || !config.voices || !config.pitch || !config.rate) {
      return new Error('config attributes missin :(')
    }

    this.selectedVoice = window.speechSynthesis
      .getVoices()
      .filter(function(voice) {
         return config.voices.includes(voice.lang);
      })
      .pop()

    this.pitch = config.pitch
    this.rate = config.rate
  }

  say(whatToSay, onStartCB, onEndCB) {
    whatToSay = getWhatToSay(whatToSay, this.piximalName) || whatToSay;

    console.debug("saying", whatToSay);

    let utterance = new SpeechSynthesisUtterance();
        utterance.text = whatToSay
        utterance.voice = this.selectedVoice
        utterance.lang = this.selectedVoice.lang
        utterance.rate = this.rate
        utterance.pitch = this.pitch

        utterance.onstart = () => {
            Logs.insert({log: whatToSay});

            if (Session.get("currentGame")) {
                const log = Games.findOne({_id: Session.get("currentGame")}).log || [];
                log.push(whatToSay);
                Games.update(Session.get("currentGame"), {"$set": {log: log}});
            }
            if(onStartCB)
              utterance.onstart = onStartCB
        };

    if(onEndCB)
      utterance.onend = onEndCB

    console.log("apa", utterance.onend);
    speechSynthesis.speak(utterance);
  }
}
