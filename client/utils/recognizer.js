window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

export class Recognizer {
    startListening(onUserInput, onEnd) {
        if (this.recognizer) {
            console.error("We're already listening, something is probably wrong");
            return;
        }

        this.recognizer = new SpeechRecognition();
        this.recognizer.interimResults = true;
        this.recognizer.continuous = true;
        this.recognizer.onstart = function() {
            console.debug("Recognition started");
        };
        this.recognizer.onend = function() {
            console.debug("Recognition ended");
            if(onEnd) onEnd();
        };
        this.recognizer.onerror = (event) => {
            console.debug("Recognition error!", event);
            this.stopListening();
            this.startListening(onUserInput);
        };

        //Take a look at https://developer.mozilla.org/en-US/docs/Web/API/SpeechGrammar
        this.lastResult = {
            text: "",
            timestamp: null,
        };
        this.intervalId = setInterval(() => {
            if (this.lastResult.timestamp) {
                if (this.lastResult.fired) {
                    clearInterval(this.intervalId);
                }

                const currentMillis = new Date().getTime();
                const millisSince = currentMillis - this.lastResult.timestamp;
                if (millisSince >= 3000) {
                    this.lastResult.fired = true;
                    this.stopListening();
                    console.debug("This is taking too loooooong, firing event even though the API isn't sure what is said");
                    onUserInput(this.lastResult.text);
                }
            }
        }, 200);
        this.recognizer.onresult = (event) => {
            let final_transcript = "";
            let interim_transcript = "";
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            console.log("FINAL, INTERIM >", final_transcript,"<, >", interim_transcript, "<");

            if (final_transcript) {

                if (!this.lastResult.fired) {
                    this.lastResult.fired = true;
                    this.stopListening();
                    onUserInput(final_transcript);
                }
            } else {
                this.lastResult.text = interim_transcript;
                this.lastResult.timestamp = new Date().getTime();
            }
        }
        this.recognizer.start();
    }

    stopListening() {
        this.lastResult.fired = "DO NOT FIRE";
        clearInterval(this.intervalId);
        if (this.recognizer) {
            console.debug("Stopping recognizer");
            this.recognizer.stop();
            this.recognizer = undefined;
        }
    }
}
