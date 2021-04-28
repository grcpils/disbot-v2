var admin = require("firebase-admin");
// Fetch the service account key JSON file contents
var serviceAccount = require("./disbotv2-126f1-b12a903627a3.json");
// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://disbotv2-126f1-default-rtdb.europe-west1.firebasedatabase.app/"
});
// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.firestore();

module.exports = db;