import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { tryFindCommand } from "/client/utils/commands";

Template.splash.onCreated(function splashOnCreated() {
console.log(Template.splash);
    API.recognizer.startListening(doShit);
});

Template.splash.onDestroyed(function splashOnDestroyed() {
    console.log("DESTROYED");
    API.recognizer.stopListening();
});

Template.splash.helpers({
});


function doShit(a) {
    console.log("Got voice command", a);
    const commands = {
        "new game": () => { 
            console.log("CREATE");
            Router.go("/create");
        },
    };
    const c = tryFindCommand(a.toLowerCase(), commands);
    if (c) {
        c();
    } else {
        console.log("Unrecognized voice command", a);
        API.recognizer.startListening(doShit);
    }
}
