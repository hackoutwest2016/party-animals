import { tryFindCommand } from "../utils/commands";
import { say } from "../utils/say";
import { levenshteinDistance } from "../utils/string-distance";
import { Recognizer } from "../utils/recognizer";
import AudioPlayer from "../utils/AudioPlayer";

export class SongAnswerMode {
    constructor() {
        this.currentQuestion = { correctAnswer: "The Killers" };
        this.song = 'https://p.scdn.co/mp3-preview/a2a9c13416fc981d035e75f16ec63b0d8e6486ba';
        this.config = {
            lang:["en-US", "en_US"],
            pitch: 2,
            rate: 0.85
        };

        this.recognizer = new Recognizer();
        this.audioPlayer = new AudioPlayer();
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
        this.audioPlayer.play(this.song)
    }

    _stopPlayingSong() {
        console.debug("Stopped the song");
        this.audioPlayer.pause()
    }

    _checkInput(speechAsText) {
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
        }
    }

    _assumeFailed() {
        this.stop();
        say("YOU FAILED! HAHA! It was " + this.currentQuestion.correctAnswer + ". You are noob, I are great", this.config);
    }
}
