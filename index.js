const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const bodyParser = require('body-parser');

const path = require('path')

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(
  cors({
    origin: '*'
  })
  );
  
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  
  var url = '';
  var palavraChave = '';
  pesquisaResultado = {};
  pesquisaResultadoW3 = {};
  
  app.post('/add', (req, res) => {
    if (req.body.site === null || req.body.site === '') {
      res.status(422).json({ message: 'Campo url do site está faltando' });
    } else if (req.body.palavra === null || req.body.palavra === '') {
      res.status(422).json({ message: 'Campo de palavras chaves está faltando.' });
    } else {
      url = req.body.site;
      palavraChave = req.body.palavra;
      res.status(200).send('ok');
    }
  });
  
  var urlValidator = '';
  
  app.get('/validacao', (req, res) => {
    axios(url)
    .then(response => {
      pesquisaResultado = {};
      const html = response?.data;
      const $ = cheerio.load(html);
      
      pesquisaResultado = {
        title: $('title')?.text()?.toUpperCase(),
        metaTagDescription: $('meta[name="description"]')?.attr('content')?.toUpperCase(),
        h1Tag: $('h1')?.text()?.toUpperCase(),
        h2Tag: $('h2')?.text()?.toUpperCase(),
        url: url,
        palavraChave: palavraChave
      };
      res.json(pesquisaResultado);
    })
    .catch(err => res.status(404).send({ message: 'Falha na requisição', error: err }));
  });
  
  app.get('/respostaW3', (req, res) => {
    urlValidator = `https://html5.validator.nu/?doc=${url}%2F`;
    axios(urlValidator)
    .then(response => {
      pesquisaResultadoW3 = {};
      const html = response.data;
      const $ = cheerio.load(html);
      
      pesquisaResultadoW3 = {
        hasError: $('.error').text(),
        urlValidator: urlValidator
      };
      
      res.json(pesquisaResultadoW3);
    })
    .catch(err => res.status(404).send({ message: 'Falha na requisição', error: err }));
  });
  
  pesquisaResultado = {};
  pesquisaResultadoW3 = {};
  
  app.listen(PORT, () => {
    console.log('server is running on port: ' + PORT);
  });
  