export function say(whatToSay, config) {
    console.debug("saying", whatToSay, "using", config);

    let selectedVoice = window.speechSynthesis
          .getVoices()
          .filter(function(voice) {
            console.log(voice)
             return config.lang.includes(voice.lang);
          })
          .pop();
    if (!selectedVoice) {
        console.error("Found no voice matching", config, "The available voices are", window.speechSynthesis.getVoices());
        return;
    }

    let utterance = new SpeechSynthesisUtterance();
        utterance.text = whatToSay;
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        utterance.rate = config.rate;
        utterance.pitch = config.pitch;

        utterance.addEventListener('start', config.onStart);
        utterance.addEventListener('end', config.onEnd);

    speechSynthesis.speak(utterance);
}
