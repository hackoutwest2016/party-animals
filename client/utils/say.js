export function say(whatToSay, config, onEnd) {
    console.debug("saying", whatToSay, "using", config);

    let selectedVoice = window.speechSynthesis
          .getVoices()
          .filter(function(voice) {
             return config.lang.includes(voice.lang);
          })
          .pop();

    if (selectedVoice) {
        console.log("GO", onEnd);
        let utterance = new SpeechSynthesisUtterance();
        utterance.text = whatToSay;
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        utterance.rate = config.rate;
        utterance.pitch = config.pitch;

        utterance.addEventListener('start', config.onStart);

        utterance.addEventListener('end', onEnd);

        speechSynthesis.speak(utterance);
    } else {
        console.error("Found no voice matching", config, "The available voices are", window.speechSynthesis.getVoices());
    }
}
