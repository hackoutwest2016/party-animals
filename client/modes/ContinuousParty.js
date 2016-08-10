import { Recognizer } from "../utils/recognizer";
import  AudioPlayer from "../utils/AudioPlayer";
import { levenshteinDistance as stringDistance } from "../utils/string-distance";
import { Games } from "../../both/collections/Games";
import { Questions } from "../../both/collections/Questions";

console.log(Games);

export class ContinuousParty {
    constructor(game, piximal) {
        const serverSideQuestions = Questions.find({_id: {"$in": game.questions}}).fetch();
        console.log("GAME IN PARTY", game.questions, serverSideQuestions);
        this.game = game;
        this.questions = serverSideQuestions.map(q => {
            return {
                id: q._id,
                answer: q.answer,
                song: q.song
            }
        });
        this.piximal = piximal;



    }

    start() {
        this.nextQuestion = 0;
        this.stopped = false;

        const later = () => setTimeout(() => this._startNextQuestion(), 600);
        API.speecher.say("new-game", this.piximal, later);
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
            Games.update(this.game._id, {"$set" : {"currentQuestion": this.currentQuestion.id}});

            this._playSong(this.currentQuestion.song);
            this._startListeningForAnswers();
        } else {
            console.debug("No next question, assuming the game is over");
            API.speecher.say("game-over", this.piximal);
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
        API.speecher.say({key: "question-failed", answer: this.currentQuestion.answer}, this.piximal, later);
    }

    _startListeningForAnswers() {
        console.debug("Starting to listen for anwser", this.currentQuestion.answer);
        API.recognizer.startListening(this._checkAnswer.bind(this));
    }

    _checkAnswer(answer) {
        console.debug("Checking", correctAnswer, answer);
        const correctAnswer = this.currentQuestion.answer;
        const distance = stringDistance(correctAnswer, answer);

        console.debug("  Distance", distance);
        if (distance <= 5) {
            this._answeredCorrectly();
        } else {
            API.speecher.say({ key: "answer-wrong", answer: answer });
            API.recognizer.startListening(this._checkAnswer.bind(this));
        }
    }

    _answeredCorrectly() {
        API.audioPlayer.pause();

        const later = () => setTimeout(() => this._startNextQuestion(), 600);
        API.speecher.say({ key: "answer-correct", answer: this.currentQuestion.answer }, this.piximal, later);
    }
}
