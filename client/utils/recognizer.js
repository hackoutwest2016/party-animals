window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

export class Recognizer {
    startListening(onUserInput) {
        if (this.recognizer) {
            console.error("We're already listening, something is probably wrong");
            return;
        }

        this.recognizer = new SpeechRecognition();
        this.recognizer.interimResults = true;
        this.recognizer.continuous = true;
        this.recognizer.onresult = (event) => {
            const whatWasSaid = event.results[0][0].transcript;
            //console.debug("Someone said", whatWasSaid); 
            onUserInput(whatWasSaid);
        }
        this.recognizer.start();
    }

    stopListening() {
        if (this.recognizer) {
            console.debug("Stopping recognizer");
            this.recognizer.stop();
            this.recognizer = undefined;
        }
    }
}
