require('dotenv').config();
const express = require('express');
const cors = require('cors');
const req = require('express/lib/request');
const dns = require('dns');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let shortUrl = {

};

const RandomNumber = (object) => {
  const min = 1;
  const max = 1000;

 while (true) {
   let random = Math.floor(Math.random() * (max - min + 1) + min);
   if (Object.keys(object).includes(random.toString())) {
     continue;
   } else {
     return random;
   }
 }

}

app.post('/api/shorturl', (req, res) => {
  let originalUrl = req.body.url;
  const urlPattern = /^(https?:\/\/)([\w.-]+)(\/.*)?$/;
  const match = originalUrl.match(urlPattern);
  
  if (!match) {
    return res.json({ error: 'invalid url' });
  }

  const hostname = match[2];
  dns.lookup(hostname, (err, address) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }
    let id = RandomNumber(shortUrl);
    shortUrl[id] = originalUrl;
    res.json({ original_url: originalUrl, short_url: id });
  });
  
});

app.get('/api/shorturl/:id', (req, res) => {
  let id = req.params.id;

  if (!shortUrl[id]) {
    return res.json({ error: 'no short url found' });
  }
  
    return res.redirect(shortUrl[id]);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
