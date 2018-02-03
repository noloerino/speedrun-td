const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const path = require('path')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})
app.get('/client.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'bin', 'client.js')
})

server.listen(8080, () => {
    console.log('server started on *:8080')
})
