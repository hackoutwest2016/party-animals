import { Animals } from '../both/collections/Animals.js'
import { Questions } from '../both/collections/Questions.js'
import { Games } from '../both/collections/Games.js'


const dummyData = {
  "animals": [
    {
      "_id": "1",
      "voices":  ["en-US", "en_US"],
      "pitch": 2,
      "rate":  0.8,
      "color":  "#c4ff1a",
      "name": "tipsy",
      "picture": "/images/monster-lime.gif",
      "score": 0
    }, {
      "_id": "2",
      "voices":  ["en-US", "en_US"],
      "pitch": 0.6,
      "rate":  0.5,
      "color":  "#ab87ff",
      "name": "flipsy",
      "picture": "/images/monster-purple.gif",
      "score": 0
    }, {
      "_id": "3",
      "voices":  ["en-US", "en_US"],
      "pitch": 0.8,
      "rate":  1,
      "color":  "#1affd5",
      "name": "mipsy",
      "picture": "/images/monster-turquoise.gif",
      "score": 0
    }
  ],
  "questions": [{
      "_id": "0",
      "question": "Wes Anderson is a very famous director with a good music taste. In which movie was this song featured?",
      "song":  "https://p.scdn.co/mp3-preview/f114bce3d424f2fbaba0fe5688ddb3d0dac786db",
      answer:"Darjeeling Limited"
    }, {
      "_id": "1",
      "question": false,
      "song": "https://p.scdn.co/mp3-preview/fd42a3f91b43b94509225aec705b4a24a5bd917b",
      answer:"Queen",
    }, {
      "_id": "2",
      "question": "You might now this band, but where are they from?",
      "song": "https://p.scdn.co/mp3-preview/289fc7594bc6d07e15f920d0fc35653e4a2d1fce",
      answer:"Norway",
    }, {
      "_id": "3",
      "question": false,
      "song": "https://p.scdn.co/mp3-preview/839d38dbf04ca2ff858eb03d0442358ffb393adb",
      answer:"The Smiths",
    }, {
      "_id": "4",
      "question": "Aww, this artist is awesome and his name is Chuck Berry. When was he born, 1926 or 1916?",
      "song": "https://p.scdn.co/mp3-preview/4857fd042d57565ff27226fce70bb3acb0c5d84a",
      answer:"1926"
    }, {
      "_id": "5",
      "question": "This is a very famous metal band, but what was the documentary called that they were featured in?",
      "song":  "https://p.scdn.co/mp3-preview/60e6f8dab43f176dd9fb5e795d4e6459bad52e9e",
      answer:"some kind of monster"
    }, {
      "_id": "6",
      "question": "Elliot Smith was loved by all indie lovers out there, but sadly he died in the beginning of 2000. how did he die?",
      "song":  "https://p.scdn.co/mp3-preview/e30aa86eb95412bb2174a6946c66f73da2e7f8c8",
      answer:"suicide"
    }, {
      "_id": "7",
      "question": false,
      "song":  "https://p.scdn.co/mp3-preview/07dbfe8eb7729d99a182b26fa1ec2f3467ba86f5",
      answer: "abba"
    }, {
      "_id": "8",
      "question": false,
      "song":  "https://p.scdn.co/mp3-preview/edbc82bbf8bd386446800a63d57270d600b65550",
      answer: "The Beatles"
    }, {
      "_id": "9",
      "question": false,
      "song":  "https://p.scdn.co/mp3-preview/fcb26a22c07a18d2e9619bee546b4849b9ad5fcb",
      answer: "Nirvana"
    }
  ]
}

Meteor.startup(() => {
  if (Games.find().count() === 0) {
    Meteor.call('games.create', {
      name: 'Thinner',
      type: 'animal-vs-all',
      animal: '1'
      }, (err, res) => {
    })
    Meteor.call('games.create', {
      name: 'Malin',
      type: 'all-vs-all',
      animal: '2'
      }, (err, res) => {
    })
  }
  if (Animals.find().count() === 0) {
    dummyData.animals.forEach(function (doc) {
      Animals.insert(doc);
    });
  }
  if (Questions.find().count() === 0) {
    dummyData.questions.forEach(function (doc) {
      Questions.insert(doc);
    });
  }
});