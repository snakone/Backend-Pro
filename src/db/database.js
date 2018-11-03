const mongoose = require('mongoose');  // MongoDB

// MongoDB URI Driver String Node.js
const URI = 'mongodb+srv://DBUSER:DBPASS@cluster0-ov8vp.mongodb.net/Hospital?retryWrites=true';
// Make Password on another FILE

mongoose.connect(URI, { useNewUrlParser: true })  // New Parse Mode
  .then(db => console.log('Mongo Cloud Status: \x1b[32m%s\x1b[0m', 'OK'))  // Promise
  .catch(err => console.error(err));

module.exports = mongoose;   // Export mongoose - Export Class on TypeScript
