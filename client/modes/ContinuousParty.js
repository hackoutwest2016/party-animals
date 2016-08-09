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
        this.piximal = piximal || {
            lang:["en-US", "en_US"],
            pitch: 2,
            rate: 0.85,
        };

        this.recognizer = new Recognizer();
        this.audioPlayer = new AudioPlayer();
    }

    start() {
        say("Starting a new game", this.piximal);
        this.nextQuestion = 0;
        this.stopped = false;
        setTimeout(() => this._startNextQuestion(), 600);
    }

    stop() {
        this.recognizer.stopListening();
        this.audioPlayer.pause();

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
            say("GAME OVER!", this.piximal);
        }
    }

    _playSong(song) {
        console.debug("Playing", song);
        this.audioPlayer.play(song, this._onSongFinished.bind(this));
    }

    _onSongFinished() {
        console.debug("SONG FINISHED WITHOUT CORRECT ANSWER");
        this.recognizer.stopListening();

        say("You failed, the correct answer was " + this.currentQuestion.answer, this.piximal);
        setTimeout(() => this._startNextQuestion(), 600);
    }

    _startListeningForAnswers() {
        console.debug("Starting to listen for anwser", this.currentQuestion.answer);
        this.recognizer.startListening(this._checkAnswer.bind(this));
    }

    _checkAnswer(answer) {
        const correctAnswer = this.currentQuestion.answer;

        console.debug("Checking", correctAnswer, answer);
        if (stringDistance(correctAnswer, answer) <= 5) {
            this._answeredCorrectly();
        }
    }

    _answeredCorrectly() {
        this.recognizer.stopListening();
        this.audioPlayer.pause();

        say("You answered correct! " + this.currentQuestion.correctAnswer, this.piximal);
        setTimeout(() => this._startNextQuestion(), 600);
    }
}
