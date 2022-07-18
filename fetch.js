const axios = require('axios')
const dotenv = require('dotenv')
if (process.env.ENV !== 'production') dotenv.config()
const redirectURL = process.env.REDIRECT_URI   
const clientId = process.env.CLIENT_ID
// const clientSecret = process.env.CLIENT_SECRET

function authenticate() {
  const codeForPreventingCSRF = 'f094a459-1d16-42d6-a709-c2b61ec53d60'  // 之後可看要不要用 session ID hash
  axios({
    method: 'get',
    url: `https://notify-bot.line.me/oauth/authorize?response_type=code&scope=notify&response_mode=form_post&client_id=${clientId}&redirect_uri=${redirectURL}&state=${codeForPreventingCSRF}`
  }).then(() => {
    console.log('Authenticated!')
  }).catch(err => {
    console.log(err)
  })
}

// 讓客戶敲 OAuth，會 post 我們 server，返回 code 之後組成以下這支去要 access token
function getAccessToken(redirectURL, clientId, clientSecret, code) {
  const token = axios({
    method: 'post',
    url: `https://notify-bot.line.me/oauth/token?grant_type=authorization_code&redirect_uri=${redirectURL}&client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(data => {
    return data.data.access_token
  })
  return token
}

const stickers = [
  11088016,
  11088017,
  11088018,
  11088019,
  11088020,
  11088021,
  11088022,
  11088023,
  11088024,
  11088025,
  11088026,
  11088027,
  11088028,
  11088029,
  11088030,
  11088031,
  11088032,
  11088033,
  11088034,
  11088035,
  11088036,
  11088037,
  11088038,
  11088039  
]

function sendMsg() {
  const accessToken = encodeURI(process.env.ACCESS_TOKEN)
  const message = ` \n機台 ${Math.floor(Math.random() * 100)} 掛掉ㄌ \n請查看`
  // const stickerPackageId = 6370
  // const stickerId = stickers[Math.floor(Math.random() * 23)]
  axios({
    method: 'post',
    url: encodeURI(`https://notify-api.line.me/api/notify?message=${message}`),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${accessToken}`
    }
  }).catch(err => {
    const statusCode = err.response.data.status
    const message = err.response.data.message
    if (statusCode === 400) {
      console.log(`ERROR: ${message}`)
    }
  })
}

module.exports = {
  sendMsg,
  getAccessToken,
  authenticate
}