// Add the required modules
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())

// connect to the specified MongoDB database
const mongoose = require('mongoose')
const mongoDB = 'mongodb+srv://Arjane:XGkbfnnhZLJN1nnq@cluster0.s7be9tp.mongodb.net/todo_app_database?retryWrites=true&w=majority'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

// Log if the connection is successful or not
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log("Database test connected")
})

/* Create a new schema in the previously specified database, 
where you can add text to the database */
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true }
})

// model
const Todo = mongoose.model('Todo', todoSchema, 'todos')

// Routes here...

/* a method to get all todos from the database, 
using an empty search query */
app.get('/todos', async (request, response) => {
    const todos = await Todo.find({})
    response.json(todos)
})

// get specific todos using their unique id
app.get('/todos/:id', async (request, response) => {
    const todo = await Todo.findById(request.params.id)
    if (todo) response.json(todo)
    else response.status(404).end()
})

// post new todos with the specified test to /todos
app.post('/todos', async (request, response) => {
    const { text } = request.body
    const todo = new Todo({
        text: text
    })
    const savedTodo = await todo.save()
    response.json(savedTodo)
})

// delete specific todos using their unique id
app.delete('/todos/:id', async (request, response) => {
    const deletedTodo = await Todo.findByIdAndRemove(request.params.id)
    if (deletedTodo) response.json(deletedTodo)
    else response.status(404).end()
})

// app listen port 3000
app.listen(port, () => {
    console.log('Example app listening on port 3000')
})