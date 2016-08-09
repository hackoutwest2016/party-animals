import { tryFindCommand } from "../utils/commands";
import { say } from "../utils/say";
import { levenshteinDistance } from "../utils/string-distance";
import { Recognizer } from "../utils/recognizer";

export class SongAnswerMode {
    constructor() {
        this.currentQuestion = { correctAnswer: "The Killers" };
        this.config = {
            lang:["en-US", "en_US"],
            pitch: 2,
            rate: 0.85
        };

        this.recognizer = new Recognizer();
    }

    start() {
        this.recognizer.startListening(this._checkInput.bind(this));
        this._startPlayingSong();
    }

    stop() {
        this.stopped = true;
        this.recognizer.stopListening();
        this._stopPlayingSong();
    }

    _startPlayingSong() {
        console.debug("Playing", this.song);
    }

    _stopPlayingSong() {
        console.debug("Stopped the song");
    }

    _checkInput(speechAsText) {
        if (this.stopped) { console.log("apa"); return; }
        console.debug("Checking input >>", speechAsText, "<<");

        const command = tryFindCommand(speechAsText);
        if (command) {
            console.debug("It matched command", command,this.config);
            command(this.config);
        } else if(this.currentQuestion) {
            //console.debug("It was not a command, assuming it's the answer to the current question");
            this._checkAnswer(speechAsText);
        } else {
            console.debug("Input was not a command and we weren't currently playing a game, ignoring it");
        }
    }

    _checkAnswer(speechAsText) {
        const distance = levenshteinDistance(speechAsText.toLowerCase(), this.currentQuestion.correctAnswer.toLowerCase());
        console.debug(speechAsText, "was", distance, "distance units from the correct answer");
        if (distance <= 6) {
            this.stop();
            say("That's correct! It was " + this.currentQuestion.correctAnswer + ". You are truly the most awesomest quesserer in the world", this.config);
        } else {
            this._assumeFailed();
        }
    }

    _assumeFailed() {
        this.stop();
        say("YOU FAILED! HAHA! It was " + this.currentQuestion.correctAnswer + ". You are noob, I are great", this.config);
    }
}
