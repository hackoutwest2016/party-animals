import { tryFindCommand } from "../utils/commands";
import { levenshteinDistance } from "../utils/string-distance";
import { Recognizer } from "../utils/recognizer";
import AudioPlayer from "../utils/AudioPlayer";
import Speecher from "../utils/AudioPlayer";

export class SongAnswerMode {
    constructor(questions, config) {
        this.config = config || {
            lang:["en-US", "en_US"],
            pitch: 2,
            rate: 0.85
        };

        this.recognizer = new Recognizer();
        this.audioPlayer = new AudioPlayer();
        this.speecher = new Speecher(this.config);

        this.questions = questions.map(question => {
            return new SongAnswerQuestion({
                correctAnswer: question.artist,
                song: question.song,
            }, this.config, this.recognizer, this.audioPlayer, this._startNextQuestion.bind(this))
        });

        this.currentQuestion = -1

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this._startNextQuestion = this._startNextQuestion.bind(this)
        this._startQuestion = this._startQuestion.bind(this)
    }

    start() {
        this._startNextQuestion();
    }

    stop() {
        const q = this.questions[this.currentQuestion];
        if (q) {
            q.stop();
        }
    }

    _startNextQuestion(answerWasCorrect) {
        console.log("TIME FOR NEXT QUESTION");
        this.currentQuestion++;
        if(this.currentQuestion < this.questions.length) {
            this._startQuestion(this.questions[this.currentQuestion]);
        } else {
            this.speecher.say("Game finished! Yay yay yay yay yay yay");
        }
    }

    _startQuestion(q) {

        function lol(){
          alert('fuck ma mama')
        }

        console.log("THIS", this);
        if (q == this.questions[0]) {
            this.speecher.say("HELLO! FIRST QUESTION", lol);
        } else {
            this.speecher.say("Okay, next question!", lol);
        }
    }

    _fuckMe() {
        console.log("FUCL");
        //setTimeout(q.start.bind(q), 600);
    }
}


class SongAnswerQuestion {
    constructor(currentQuestion, config, recognizer, audioPlayer, onQuestionFinished) {
        this.currentQuestion = currentQuestion;
        this.config = config;
        this.recognizer = recognizer;
        this.audioPlayer = audioPlayer;
        this.onQuestionFinished = onQuestionFinished;
    }

    start() {
        this.stopped = false;
        this.recognizer.startListening(this._checkInput.bind(this));
        this._startPlayingSong();
    }

    stop(answerWasCorrect) {
        console.log("stopping question");
        this.stopped = true;
        this.recognizer.stopListening();
        this._stopPlayingSong();
        this.onQuestionFinished(answerWasCorrect);
    }

    _startPlayingSong() {
        console.debug("Playing", this.currentQuestion.song);
        this.audioPlayer.play(this.currentQuestion.song)
    }

    _stopPlayingSong() {
        console.debug("Stopped the song");
        this.audioPlayer.pause()
    }

    _checkInput(speechAsText) {
        if (this.stopped) {return;}
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
            this.stop(true);
            this.speecher.say("That's correct! It was " + this.currentQuestion.correctAnswer + ". You are truly the most awesomest quesserer in the world", this.config);
        }
    }

    _assumeFailed() {
        this.stop(false);
        this.speecher.say("YOU FAILED! HAHA! It was " + this.currentQuestion.correctAnswer + ". You are noob, I are great", this.config);
    }
}
