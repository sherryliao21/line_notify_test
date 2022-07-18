const service = require('./fetch')
const express = require('express')
const app = express()
const PORT = 3000
const redirectURL = process.env.REDIRECT_URI   
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/authorize-line-notify', async (req, res) => {
  await service.authenticate()
  return res.status(200).send('OK')
})

app.post('/test', async (req, res) => {
  const code = req.body.code
  const accessToken = await service.getAccessToken(redirectURL, clientId, clientSecret, code)
  process.env.ACCESS_TOKEN = accessToken
  process.env.IS_AUTHORIZED = 'true'

  return res.status(200).send('OK')
})

app.listen(PORT, () => {
  console.log(`Express app is now running on ${PORT}..`)
})

setInterval(() => {
  if (process.env.IS_AUTHORIZED === 'true') {
    service.sendMsg()
  }
}, 5000)

