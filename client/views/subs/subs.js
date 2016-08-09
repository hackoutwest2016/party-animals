import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.subs.onCreated(function speechOnCreated() {
  this.subs = new ReactiveVar([]);
  startTranscript();
});

Template.subs.helpers({
    currentSubs() {
        return Template.instance().subs.get();
    }
});

function startTranscript() {
    const thingsToSay = [];
    thingsToSay.push("Hello!");
    thingsToSay.push("I am a party animal");
    thingsToSay.push("");
    thingsToSay.push("I exist because I am funny, and also scary");
    thingsToSay.push("Roooaaar");
    thingsToSay.push("");
    thingsToSay.push("Sometimes I sing and want you to guess which song I'm singing");
    thingsToSay.push("sometimes you play with friends");
    thingsToSay.push("sometimes you play with friend. That's me!");
    thingsToSay.push("Sometimes I wont sing unless you throw me around. Wi-ii-iii. I like it rough");
    thingsToSay.push("");
    thingsToSay.push("See you again tomorrow!");
    thingsToSay.push("Bye!");

    doTranscript(thingsToSay, 0);
}

function doTranscript(thingsToSay, currentThingIndex) {
    if (currentThingIndex < thingsToSay.length) {
        say(thingsToSay[currentThingIndex], () => {
            setTimeout(
                    () => doTranscript(thingsToSay, currentThingIndex + 1),
                    300
            );
        });
    } else {
        console.log("DONE");
    }
}

function say(whatToSay, onSoundFinished) {
    console.log(whatToSay);
    soundSay(whatToSay, {
            lang:["en-US", "en_US"],
            pitch: 2,
            rate: 0.85,
            onEnd: onSoundFinished,
        });
    displaySay(whatToSay);
}

function displaySay(whatToSay) {
    const apa = document.getElementById("subs-space");
    if (!apa) {
        console.log(":DSADSAKD:K");
        setTimeout(() => displaySay(whatToSay),1);
        return;
    }
    const child = document.createElement("div");
    child.appendChild(document.createTextNode(whatToSay));
    apa.appendChild(child);
}
