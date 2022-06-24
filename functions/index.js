const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const cors = require("cors");

admin.initializeApp(functions.config().firebase);
var database = admin.database();

const app = express();
app.use(cors({ origin: true }));

app.get("/init", async (req, res) => {
  var updates = {};
  (updates["/Soccer/"] = {
    "Premier League": {
      "Manchester vs Chelsea": {
        ID: 1000,
      },
    },
    "Second League": {
      "Barcelone vs Real Madrid": {
        ID: 2000,
      },
      "PSG vs Marseille": {
        ID: 3000,
      },
    },
  }),
    (updates["/Odds/"] = {
      1000: {
        odds1: 3.4,
        odds2: 4.5,
      },
      2000: {
        odds1: 1.1,
        odds2: 2.7,
      },
      3000: {
        odds1: 3.6,
        odds2: 4.1,
      },
    }),
    await database.ref().update(updates);
  res.send("added data");
});

app.get("/", async (req, res) => {
  const eventID = req.query.eventID;
  console.log(eventID);
  let sportData,
    oddsData = {};
  let sportRef = null;
  let data = {};

  switch (req.query.sport) {
    case "soccer":
      sportRef = database.ref("Soccer");
      break;
    case "basket":
      sportRef = database.ref("Basket");
      break;
    case "tennis":
      sportRef = database.ref("Tennis");
      break;
    default:
      res.status(400).send("must receive a sport in parameter");
  }

  await sportRef.once("value", (snapshot) => {
    sportData = snapshot.val();
  });

  eventID
    ? res.send(
        (data[eventID] = {
          Odds: await database
            .ref(`Odds/${eventID}`)
            .once("value", (snapshot) => {
              oddsData = snapshot.val();
            }),
        })
      )
    : await database.ref("Odds").once("value", (snapshot) => {
        oddsData = snapshot.val();
      });

  Object.keys(sportData).forEach((league) => {
    console.log("league", league);
    Object.keys(sportData[league]).forEach((match) => {
      console.log("     match", match);
      Object.entries(sportData[league][match]).forEach((entry) => {
        console.log("       entry", entry);
        data[entry[1]] = { Odds: oddsData[entry[1]] };
      });
    });
  });
  res.send(data);
});

exports.api_express = functions.https.onRequest(app);
