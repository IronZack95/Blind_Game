const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'));
app.use(express.json({limit : '2mb'}));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})
