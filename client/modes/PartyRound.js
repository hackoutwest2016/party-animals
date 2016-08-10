import { levenshteinDistance as stringDistance } from "../utils/string-distance";
import { API } from "../utils/API";
import { Games } from "../../both/collections/Games";
import { Questions } from "../../both/collections/Questions";
import { Players } from "../../both/collections/Players";
import { Animals } from "../../both/collections/Animals";

export class PartyRound {
    constructor(game, piximal) {
        const serverSidePlayers = Players.find({_id: {"$in": game.players}}).fetch();
        const serverSideQuestions = Questions.find({_id: {"$in": game.questions}}).fetch();
        this.game = game;
        this.questions = serverSideQuestions.map(q => {
            return {
                id: q._id,
                answer: q.answer,
                song: q.song
            }
        });
        console.log("Questions", game.questions, serverSideQuestions, this.questions);
        this.piximal = Animals.findOne({_id: game.animal});
        console.log("Piximal", this.piximal);
        this.players = serverSidePlayers.map(p => {
            return {
                id: p._id,
                name: p.name,
            }
        });
        console.log("Players", this.players);
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
            this.currentPlayer = this._getNextPlayer();
            console.debug("Starting", nextQuestion, "for player", this.currentPlayer);

            this.currentQuestion = nextQuestion;
            Games.update(this.game._id, {"$set" : {"currentQuestion": this.currentQuestion.id}});

            API.speecher.say({key:"next-player", player:this.currentPlayer.name}, this.piximal, () => {
                const later = () => setTimeout(() => {
                    this._playSong(this.currentQuestion.song);
                    this._startListeningForAnswers();
                }, 600);
                if (this.currentQuestion.question != "false") {
                    API.speecher.say(this.currentQuestion.question, this.piximal, later);
                } else {
                    API.speecher.say("start-guess-artist", this.piximal, later);
                }
            });
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

        const newScore = Animals.findOne({_id: this.piximal._id}).score + 1;
        Animals.update(this.piximal.id, {"$set": {"score": newScore}});
    }

    _startListeningForAnswers() {
        console.debug("Starting to listen for anwser", this.currentQuestion.answer);
        API.recognizer.startListening(this._checkAnswer.bind(this));
    }

    _checkAnswer(answer) {
        const correctAnswer = this.currentQuestion.answer;
        console.debug("Checking", correctAnswer, answer);
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

        const newScore = Players.findOne({_id: this.currentPlayer.id}).score + 1;
        Players.update(this.currentPlayer.id, {"$set": {"score": newScore}});
    }

    _getNextPlayer() {
        const id = Math.floor(Math.random() * this.players.length);
        return this.players[id];
    }
}
