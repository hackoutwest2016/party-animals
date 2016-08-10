// what can be a string representing the Id of what we're trying to say, look at the table below for valid values
// what can also be an object on the form
// {
//    key: THE-ID-OF-WHAT-WE'RE-TRYING-TO-SAY
//    var1: value-of-var1
//    var2: value-of-var2
// }
// in which case we'll use the key to look up the template string in the table below and
// replace all instances of {var1} with value-of-var1 and so forth.
export function getWhatToSay(what, piximalName) {
    const piximalDictionary = apa[piximalName];
    if (piximalDictionary) {
        const whatId = typeof(what) === "string" ? what : what.key;
        let whatToSay = piximalDictionary[whatId] || apa["fallback"][whatId];

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
    } else {
        return getWhatToSay(what, "fallback");
    }
}


const apa = {
    "fallback": {
        "new-game": "We're starting a new game! Wii-ii-iii-iii",
        "answer-correct": "{answer} was correct! You are leet indeed",
        "answer-wrong": "Aaw, {answer} was not correct. You fail",
        "game-over": "Game over!",
        "next-player": "Okay, time for {player}",
    },
    "purple": {

    }
}
