const express = require('express');
const app = express();
const fs = require('fs')
const SQL = require('sql-template-strings')
const { Client } = require('pg')
const connectionString = 'postgres://' + process.env.POSTGRES_USER + '@localhost/bulletinboard';
const client = new Client({
	connectionString: connectionString,
})

const bodyParser = require('body-parser');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public/styles'));
app.use(express.static('public/javascripts'));

app.use(bodyParser.urlencoded({extended: true}));

client.connect();

// GET homepage
app.get('/', function(request, response) {
    response.render('index');
});

app.post('/button', function(request, response){
	let inputTitle = request.body.title;
	let inputBody = request.body.body;
	console.log(inputTitle);				// it works
	console.log(inputBody);				// it works

	// client.query to add entries
	

	client.query(SQL`insert into messages (title,body) values (${inputTitle},${inputBody})`, (err) => {
		console.log(err ? err.stack : 'new message added to the database')
		
	})
	response.redirect('/messages')
})

app.get('/messages', function(request, response) {
	console.log("hello")
	// client.query to retrieve the datafrom the database
	client.query('select * from messages', (err, res) => {
    console.log(res.rows)		// res.rows is an array with objects

    response.render('messages', {messages: res.rows});
    // console.log(messages);
	})
});

app.listen(3000, function() {
    console.log('Bulletin board app is listening on port 3000!')
})