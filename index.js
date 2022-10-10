const { randomUUID } = require('crypto');
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const methodOverride = require('method-override');
const { v4: uuid } = require('uuid');
uuid();

app.use(express.urlencoded({ extended: true })); // any form data that comes in a post request, please parse it
app.use(express.json()); // any form data that comes in a post request as json object please parse it
app.set('view engine', 'ejs'); // This enables ejs as the template for rendering views
app.set('views', path.join(__dirname, '/views')); // changes the path to view folder from current working directory to dirname > /views so I can execute nodemon index.js from different folders and work
app.use(methodOverride('_method')); // package enables override form post http to patch
app.use(express.static(path.join(__dirname, 'public')));

const date = new Date();

// Adding a time logger to all requests -- for fun & to practice middleware from docs
const logTime = function (req, res, next) {
    req.requestTime = Date.now();
    const time = new Date(req.requestTime);
    console.log(`Logged a request on: ${time.toUTCString()}`);
    next();
}

app.use(logTime);

// List of to-dos
let todos = [];

// GET route on the index page -- List all ToDo's
app.get('/', (req, res) => {
    res.render('home', { todos });
})

// POST route on the index page -- Create new ToDo
app.post('/', (req, res) => {
    const { todo } = req.body;
    todos.push({ todo, id: uuid() });
    res.redirect('/');
})

// GET route on a index/:id -- Edit a specific ToDo
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const todo = todos.find(t => t.id === id);
    res.render('edit', { todo });
})

// PATCH route on /edit/:id -- Update a specific ToDo
app.patch('/edit/:id', (req, res) => {
    const { id } = req.params;
    const newTodo = req.body.todo;
    const foundTodo = todos.find(t => t.id === id);
    foundTodo.todo = newTodo;
    res.redirect('/');
})

// DELETE route on /edit/:id -- Delete a specific ToDo
app.delete('/edit/:id', (req, res) => {
    const { id } = req.params;
    todos = todos.filter(t => t.id !== id);
    res.redirect('/');
})

// Begin by listeng on port 3000. Start server via CLI to begin.
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

// Handle a 404 response with USE (works for all requests, so must be at bottom of stack) 
app.use((req, res, next) => {
    res.status(404).send("This page does not exist. Try something else.")
})