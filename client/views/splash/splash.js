import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { tryFindCommand } from "/client/utils/commands";
import { API } from "/client/utils/API";

Template.splash.onCreated(function splashOnCreated() {
    API.speecher.say('Hi cutey! Ready to party like a piximal?')
    API.recognizer.startListening(acceptVoiceCommand);
});

Template.splash.onDestroyed(function splashOnDestroyed() {
    console.log("DESTROYED");
    API.recognizer.stopListening();
});

Template.splash.helpers({
});

function acceptVoiceCommand(a) {
    console.log("Got voice command", a);
    a = a.toLowerCase();
    if (a.includes("new") && a.includes("game")) {
        console.log("CREATE");
        Router.go("/create");
    } else {
        console.log("Unrecognized voice command", a);
        API.recognizer.startListening(acceptVoiceCommand);
    }
}
