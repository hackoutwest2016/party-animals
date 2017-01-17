import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { tryFindCommand } from "/client/utils/commands";
import { API } from "/client/utils/API";

Template.welcome.onCreated(function welcomeOnCreated() {
    API.speecher.say('Hi, we are party pixels, welcome to our presentation!')
});
