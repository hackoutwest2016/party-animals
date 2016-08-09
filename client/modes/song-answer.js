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
        this.recognizer.startListening(this.checkInput);
        this.checkInput("the killers");
    }

    checkInput(speechAsText) {
        console.debug("Checking input", speechAsText, this.config);

        const command = tryFindCommand(speechAsText);
        if (command) {
            console.debug("It matched command", command);
            command(this.config);
        } else if(this.currentQuestion) {
            console.debug("It was not a command, assuming it's the answer to the current question");
            this.checkAnswer(speechAsText);
        } else {
            console.debug("Input was not a command and we weren't currently playing a game, ignoring it");
        }
    }

    checkAnswer(speechAsText) {
        console.debug("Correct answer:", this.currentQuestion.correctAnswer);

        const distance = levenshteinDistance(speechAsText.toLowerCase(), this.currentQuestion.correctAnswer.toLowerCase());
        console.debug(speechAsText, "was", distance, "distance units from the correct answer");
        if (distance < 15) {
            this.recognizer.stopListening();
            say("That's correct! It was " + this.currentQuestion.correctAnswer + ". You are truly the most awesomest quesserer in the world", this.config);
        } else {
            assumeFailed();
        }
    }

    assumeFailed() {
        this.recognizer.stopListening();
        say("YOU FAILED! HAHA! It was " + this.currentQuestion.correctAnswer + ". You are noob, I are great", this.config);
    }
}
