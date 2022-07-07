const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const cors = require("cors");

admin.initializeApp(functions.config().firebase);
var database = admin.database();

const app = express();
app.use(cors({ origin: true }));

// URL: ../functions-api-162ea/us-central1/api_express/?sport=soccer
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
      Object.keys(sportData[league]).forEach((game) => {
        // console.log("     game : ", game);
        Object.entries(sportData[league][game]).forEach((entry) => {
          // console.log("       entry : ", entry);
          data[entry[1]] = { Odds: oddsData[entry[1]] };
        });
      });
    });
  }
  res.status(200).send(data);
});

app.get("/test2/", async (req, res) => {
  let path = ["mappings/soccer/pinnacle"]; //to modify
  let ref = database.ref(path[0]);
  console.log(2);
  res.send({ a: 3 });
});

// URL: ../functions-api-162ea/us-central1/api_express/?token=#####
app.get("/test1/", async (req, res) => {
  let path = ["mappings/soccer/pinnacle"]; //to modify
  let response = [["*", "*", "cutoffAt"]]; //to modify
  let responseFilter = [["IDcounter"], ["*", "*", "id"]]; //to modify

  let ref = database.ref(path[0]);
  let data = {};

  await ref.once("value", (snapshot) => {
    data = snapshot.val();
  });

  const { IDcounter, ...rest } = data;
  data = rest;

  Object.keys(data).forEach((league) => {
    Object.keys(data[league]).forEach((game) => {
      //delete data[league][game].id;
      const { id, ...rest } = data[league][game];
      data[league][game] = rest;
    });
  });

  res.status(200).send(data);
});

exports.api_express = functions.https.onRequest(app);
