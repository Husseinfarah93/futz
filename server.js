let express = require('express')
let app = express(), path = require('path')


app.use('/public', express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})


app.listen(3000, () => {
  console.log('listening on port 3000')
})