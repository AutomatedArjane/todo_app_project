const express = require('express') 
const cors = require('cors')
const app = express()
const port = 3000

// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())

// mongo here...

// todos-route
app.get('/todos', (request, response) => {
  response.send('Todos')
})

// app listen port 3000
app.listen(port, () => {
  console.log('Example app listening on port 3000')
})