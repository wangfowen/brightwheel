let express = require('express');
let app = express();

app.post('/email', (req, res) => {
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

module.exports = app;
