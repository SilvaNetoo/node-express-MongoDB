const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

var db;
var cursor;

app.set('index', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect('mongodb://mongo1:mongo1@ds231941.mlab.com:31941/star-wars-quotes', { useNewUrlParser: true }, (err, client) => {

    if (err) {
        return console.log(err);
    }

    db = client.db('star-wars-quotes');

    /**
     * Inicia a conexão com a porta 3000 o caso desse estudo
     */
    app.listen(3000, () => {
        console.log('listening on 3000');
    });
});

/**
 * O browser faz uma get para que seja recebido algo, no caso foi passado o arquivo index.html
 * sendo a responta para o browser
 */
app.get("/", (req, res) => {
    // res.sendFile(__dirname + '/index.html');
    db.collection('quotes').find().toArray(function (err, results) {
        if (err) return console.log(err);

        res.render('index.ejs', { quotes: results });
    })
});

/**
 * No html existe um (action="/quotes") que direciona a requisição para a urn desejada
 * no caso do exemplo abaixo é "/quotes", quando é dado um submit é chamado esse matodo para com a urn.
 */
app.post("/quotes", (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) {
            return console.log(err);
        }

        console.log('Saved success');
        res.redirect('/');
    })
    console.log(req.body);
});

app.put("/quotes", (req, res) => {
    db.collection('quotes').findOneAndUpdate(
        {
            name: 'Yoda'
        },
        {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        }
        ,
        {
            sort: { _id: -1 },
            upsert: true
        },
        (err, result) => {
            if (err) return res.send(err)
            res.send(result)
        }
    )
})

app.delete("/quotes", (req, res) => {
    db.collection('quotes').findOneAndDelete(
        {
            name: req.body.name
        },
        (err, result) => {
            if (err) return res.send(500, err)
            res.send({ message: 'A darth vadar quote got deleted' })
        }
    )
})