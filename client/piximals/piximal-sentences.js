// what can be a string representing the Id of what we're trying to say, look at the table below for valid values
// what can also be an object on the form
// {
//    key: THE-ID-OF-WHAT-WE'RE-TRYING-TO-SAY
//    var1: value-of-var1
//    var2: value-of-var2
// }
// in which case we'll use the key to look up the template string in the table below and
// replace all instances of {var1} with value-of-var1 and so forth.
export function getWhatToSay(what, piximal) {
    const piximalName = piximal ? piximal.Name : "fallback";
    const piximalDictionary = apa[piximalName.toLowerCase()];
    if (piximalDictionary) {
        let whatToSay = findWhatToSay(piximalDictionary, what, piximal);
        whatToSay = replaceVariables(whatToSay, what);    
        return whatToSay;
    } else {
        return getWhatToSay(what, "fallback");
    }
}

function findWhatToSay(piximalDictionary, what, piximal) {
    const whatId = typeof(what) === "string" ? what : what.key;
    let whatToSay = piximalDictionary[whatId] || apa["fallback"][whatId];

    if (Array.isArray(whatToSay)) {
        const randomId = Math.floor(Math.random() * whatToSay.length);
        return whatToSay[randomId];
    } else if (typeof(whatToSay) === "object") {
        const moodBased = whatToSay[piximal.mood];
        return moodBased || whatToSay[Object.keys(whatToSay)[0]];
    } else {
        return whatToSay;
    }
}

function replaceVariables(whatToSay, what) {
    if (typeof(what) !== "string") {
        // We're trying to say something more complex than a constant sentence
        // replace all {VARIABLE} with the value given in the what object
        for (let k of Object.keys(what)) {
            if (k !== "key") {
                whatToSay = whatToSay.replace("{" + k + "}", what[k]);
            }
        }
    }

    return whatToSay;
}


const apa = {
    "fallback": {
        "new-game": "We're starting a new game! Wii-ii-iii-iii",
        "answer-correct": ["{answer} was correct! You are leet indeed", "That's right! It was {answer}. Way to go!", "Oooh yeeaaaah! {anwser}!"],
        "answer-wrong": ["Nah, {answer} was not right", "Sadly {answer} was wrong", "Did you really think the anwser was {answer}? Better shape up", "A deaf table has more correct answers than you, {answer} was not right", "I regret to inform you that {answer} is wrong"],
        "question-failed": "Time's up! {answer} was the correct answer. You fail",
        "game-over": "Game over!",
        "next-player": "Okay, time for {player}",
        "start-guess-artist": "Who sings this song?",
        "start-guess-country": "Where does the band that sings this song come from?",
    },
    "flipsy": {
        "new-game"          : "Neeew game! Are you ready, this is gonna be fuxxing awesome!" ,                                                                     
        "answer-correct"    : "{answer} was correct! You are rad!",
        "answer-wrong"      : "Sorry, {answer} is not it, epic fail!",
        "question-failed"   : "Woops, you’re thinking too hard, or maybe not at all? Hihi, just kidding. {answer} was the correct answer!",                           
        "game-over"         : "Oh noes, the game is already over! Thanks for playing, I looove you!",
        "next-player"           : "So, {player} you’re up!",
        "Start-guess-artist"    : "So, which artist is this?",
    },
    "tipsy": {
        "new-game"          : "New game it is, me so happy!",                                                                     
        "answer-correct"    : "Right-a-mundo friendo! {answer} it is! You so pro.",
        "answer-wrong"      : "Whoopsie-doo, {answer} is wrong.",
        "question-failed"   : "No more time for you! {answer} was the right answer answer. Oh, the shame",  
        "game-over"         : "No more game left! Come back and play soon!",
        "next-player"           : "Now it’s {player} turn!",
        "Start-guess-artist"    : "Who’s the singer?",
    },
    "mipsy": {
        "new-game"          : "We're starting a new game! Wii-iiii!",                                                                     
        "answer-correct"    : "{answer} was correctamundo! You are leet indeed",
        "answer-wrong"      : "Nah, {answer} was not right",
        "question-failed"   : "Time's up! {answer} was the correct answer. You fail",
        "game-over"         : "Game finished, thank you for playing with me!",
        "next-player"           : "Okay, time for {player}",
        "Start-guess-artist"    : "Who sings this song?",
    },
}
