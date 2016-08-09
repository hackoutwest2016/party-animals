import { levenshteinDistance } from "../utils/string-distance";
import { say } from "../utils/say";

export const commands = {
  "penis": penis,
  "malin": penis,
  "hanna": penis,
  "amanda": penis,
  "pdawg": penis,
  "p-dwag": penis,
  "thinner": penis,
}

function penis(config) {
    say("Your best friend is a penis", config);
}

export function tryFindCommand(candidateKey) {
    const unsortedDistances = calculateDistanceToEachCommand(commands, candidateKey);
    const sortedDistances = unsortedDistances.sort((a,b) => a.distance - b.distance);
    const mostLikelyCandidate = sortedDistances[0];
  
    console.debug("Distances to", candidateKey, sortedDistances, mostLikelyCandidate);
    if (mostLikelyCandidate.distance <= 4) {
        return commands[mostLikelyCandidate.command]
    } else {
        return null;
    }
}

function calculateDistanceToEachCommand(commands, candidateKey) {
    const loweredCandidate = candidateKey.toLowerCase();

    const toReturn = [];
    for(let key of Object.keys(commands)) {
        const apa = {
            command: key,
            distance: levenshteinDistance(key.toLowerCase(), loweredCandidate),
        };
        toReturn.push(apa);
    }
    return toReturn;
}

