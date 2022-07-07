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
  console.log(1);
});

// URL: ../functions-api-162ea/us-central1/api_express/?token=#####
app.get("/test1/", async (req, res) => {
  let path = ["mappings/soccer/pinnacle/"];
  let response = [["*", "*", "cutoffAt"]]; //no need
  let filters = [["IDcounter"], ["*", "*", "id"]];

  try {
    let ref = database.ref(path[0]);
    let data = {};

    await ref.once("value", (snapshot) => {
      data = snapshot.val();
    });

    const filter = (myData, filters) => {
      filters.forEach((filter) => {
        const deep = filter.length;
        const filterOn = (level, obj) => {
          if (level === 1) {
            delete obj[filter[deep - level]];
            return obj;
          } else if (filter[deep - level] !== "*") {
            obj[filter[deep - level]] = filterOn(
              level - 1,
              obj[filter[deep - level]]
            );
            return obj;
          } else {
            Object.keys(obj).forEach((childKey) => {
              obj[childKey] = filterOn(level - 1, obj[childKey]);
            });
            return obj;
          }
        };
        myData = filterOn(deep, myData);
      });
      return myData;
    };
    res.status(200).send(filter(data, filters));
  } catch (error) {
    res.status(400).send({ error: "Invalids arguments" });
  }
});

exports.api_express = functions.https.onRequest(app);
