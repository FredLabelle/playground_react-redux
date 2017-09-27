var axios = require('axios');

const userName = 'efounders'
const password = 'eFounders75010'
const API_KEY = '34750bf146b034b389b9315eefc84a41b506bbf3'
var API_URL = 'https://sandbox.treezor.com/v1/index.php/wallets'

function api_call() {

  const Auth_Key = "Bearer " + API_KEY

  axios.get(API_URL, {
    headers: {
      'Authorization': Auth_Key,
      'Accept': 'application/json'
    }
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
}

api_call()
