const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const cors = require("cors");

admin.initializeApp(functions.config().firebase);
var database = admin.database();

const app = express();
app.use(cors({ origin: true }));

// const initRTDB = async () => {
//   var updates = {};
//   updates["/Soccer/"] = {
//     "Premier League": {
//       "Manchester vs Chelsea": {
//         ID: 1000,
//       },
//     },
//     "Second League": {
//       "Barcelone vs Real Madrid": {
//         ID: 2000,
//       },
//       "PSG vs Marseille": {
//         ID: 3000,
//       },
//     },
//   };
//   updates["/Basket/"] = {
//     "League 1": {
//       "TeamA vs TeamB": {
//         ID: 4000,
//       },
//     },
//     "League 2": {
//       "TeamC vs TeamD": {
//         ID: 5000,
//       },
//       "TeamE vs TeamF": {
//         ID: 6000,
//       },
//     },
//   };
//   updates["/Odds/"] = {
//     1000: {
//       odds1: 3.4,
//       odds2: 4.5,
//     },
//     2000: {
//       odds1: 1.1,
//       odds2: 2.7,
//     },
//     3000: {
//       odds1: 3.6,
//       odds2: 4.1,
//     },
//     4000: {
//       odds1: 2.4,
//       odds2: 4.5,
//     },
//     5000: {
//       odds1: 2.1,
//       odds2: 0.7,
//     },
//     6000: {
//       odds1: 1.6,
//       odds2: 3.9,
//     },
//   };
//   await database.ref().update(updates);
// };

app.get("/", async (req, res) => {
  const eventID = req.query.eventID;
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
    default:
      res.status(400).send("must receive a sport in parameter");
  }

  await sportRef.once("value", (snapshot) => {
    sportData = snapshot.val();
  });

  if (eventID) {
    await database.ref(`Odds/${eventID}`).once("value", (snapshot) => {
      oddsData = snapshot.val();
      if (!oddsData) {
        res
          .status(400)
          .send(`No event is coresponding to this ID : ${eventID}`);
      }
      data[eventID] = {
        Odds: oddsData,
      };
    });
  } else {
    await database.ref("Odds").once("value", (snapshot) => {
      oddsData = snapshot.val();
    });
    Object.keys(sportData).forEach((league) => {
      // console.log("league : ", league);
      Object.keys(sportData[league]).forEach((match) => {
        // console.log("     match : ", match);
        Object.entries(sportData[league][match]).forEach((entry) => {
          // console.log("       entry : ", entry);
          data[entry[1]] = { Odds: oddsData[entry[1]] };
        });
      });
    });
  }
  res.status(200).send(data);
});

// initRTDB();

exports.api_express = functions.https.onRequest(app);
