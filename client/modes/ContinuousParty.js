import { Recognizer } from "../utils/recognizer";
import  AudioPlayer from "../utils/AudioPlayer";
import { levenshteinDistance as stringDistance } from "../utils/string-distance";

export class ContinuousParty {
    constructor(questions, piximal) {
        this.questions = questions.map(q => {
            return {
                answer: q.artist,
                song: q.song
            }
        });
        this.piximal = piximal;
    }

    start() {
        const later = () => setTimeout(() => this._startNextQuestion(), 600);
        API.speecher.say("Starting a new game", this.piximal, later);
        this.nextQuestion = 0;
        this.stopped = false;
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
            console.debug("Starting", nextQuestion);

            this.currentQuestion = nextQuestion;
            this._playSong(this.currentQuestion.song);
            this._startListeningForAnswers();
        } else {
            console.debug("No next question, assuming the game is over");
            API.speecher.say("GAME OVER!", this.piximal);
        }
    }

    _playSong(song) {
        console.debug("Playing", song);
        API.audioPlayer.play(song, this._onSongFinished.bind(this));
    }

    _onSongFinished() {
        console.debug("SONG FINISHED WITHOUT CORRECT ANSWER");
        API.recognizer.stopListening();

        const later = () => setTimeout(() => this._startNextQuestion(), 600);
        API.speecher.say("You failed, the correct answer was " + this.currentQuestion.answer, this.piximal, later);
    }

    _startListeningForAnswers() {
        console.debug("Starting to listen for anwser", this.currentQuestion.answer);
        API.recognizer.startListening(this._checkAnswer.bind(this));
    }

    _checkAnswer(answer) {
        const correctAnswer = this.currentQuestion.answer;
        const distance = stringDistance(correctAnswer, answer);

        console.debug("Checking", correctAnswer, answer, distance);
        if (distance <= 5) {
            this._answeredCorrectly();
        } else {
            API.speecher.say("Nah, " + answer + " is not right, try again");
            API.recognizer.startListening(this._checkAnswer.bind(this));
        }
    }

    _answeredCorrectly() {
        API.audioPlayer.pause();

    const later = () => setTimeout(() => this._startNextQuestion(), 600);
    API.speecher.say("You answered correct! " + this.currentQuestion.answer, this.piximal, later);
}
}
