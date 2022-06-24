# httpAPI

app.get("/1", (req, res) => {
const soccerReference = database.ref("Soccer");
soccerReference.once("value", (snapshot) => {
snapshot.forEach((childSnapshot) => {
const childKey = childSnapshot.key;
const childValue = childSnapshot.val();
console.log(childKey + " : " + childValue);
});
res.send(snapshot.val());
});
});
