import { say } from "../utils/say";

const commands = {
  "penis": penis,
}

function penis(config) {
    say("Your best friend is a penis", config);
}

export function checkInput(speechAsText, config) {
    console.debug("Checking input", speechAsText, config);

    const command = tryFindCommand(speechAsText);
    if (command) {
        console.debug("It matched command", command);
        command(config);
    } else {
        console.debug("It was not a command, assume it's the answer to the current question");
    }
}

function tryFindCommand(candidateKey) {
    // TODO: Look for the command that most closely matches the candidateKey and if the
    // match is good enough, return that command.
    return commands[candidateKey];
}
