import { levenshteinDistance as stringDistance } from "../utils/string-distance";
import { API } from "../utils/API";

export class PartyRound {
    constructor(questions, players, piximal) {
        this.questions = questions.map(q => {
            return {
                answer: q.artist,
                song: q.song
            }
        });
        this.players = players;
        this.piximal = piximal; 
    }

    start() {
        API.speecher.say("Starting a new game", this.piximal);
        this.nextQuestion = 0;
        this.stopped = false;
        setTimeout(() => this._startNextQuestion(), 600);
    }

    stop() {
        API.recognizer.stopListening();
        API.audioPlayer.pause();

        this.stopped = true;
    }

    _startNextQuestion() {
        if (this.stopped) {
            return;
        }

        const nextQuestion = this.questions[this.nextQuestion];
        this.nextQuestion++;
        if (nextQuestion) {
            this.currentPlayer = this._getNextPlayer();

            console.debug("Starting", nextQuestion, "for player", this.currentPlayer);

            this.currentQuestion = nextQuestion;
            this._playSong(this.currentQuestion.song);
            this._startListeningForAnswers();
        } else {
            console.debug("No next question, assuming the game is over");
            API.speecher.say("GAME OVER!", this.piximal);
        }
    }

    _getNextPlayer() {
        const id = Math.floor(Math.random() * this.players.length);
        return this.players[id];
    }

    _playSong(song) {
        console.debug("Playing", song);
        API.audioPlayer.play(song, this._onSongFinished.bind(this));
    }

    _onSongFinished() {
        console.debug("SONG FINISHED WITHOUT CORRECT ANSWER");
        API.recognizer.stopListening();
        
        API.speecher.say("You failed, the correct answer was " + this.currentQuestion.answer, this.piximal);
        setTimeout(() => this._startNextQuestion(), 600);
    }

    _startListeningForAnswers() {
        console.debug("Starting to listen for anwser", this.currentQuestion.answer);
        API.recognizer.startListening(this._checkAnswer.bind(this));
    }

    _checkAnswer(answer) {
        const correctAnswer = this.currentQuestion.answer;

        console.debug("Checking", correctAnswer, answer);
        if (stringDistance(correctAnswer, answer) <= 5) {
            this._answeredCorrectly();
        }
    }

    _answeredCorrectly() {
        API.recognizer.stopListening();
        API.audioPlayer.pause();

        API.speecher.say("You answered correct! " + this.currentQuestion.correctAnswer, this.piximal);
        setTimeout(() => this._startNextQuestion(), 600);
    }
}
