const service = require('./fetch')
const express = require('express')
const app = express()
const PORT = 3000
const ngrokUrl = process.env.REDIRECT_URL   
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/test', async (req, res) => {
  const code = req.body.code
  const accessToken = await service.getAccessToken(ngrokUrl, clientId, clientSecret, code)
  console.log('HERE IS THE ACCESS TOKEN: ', accessToken)
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

