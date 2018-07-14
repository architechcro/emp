# Express Moleculer Proxy - EMP
## testing repo

### Installation

Clone repo and run
```
npm install
```

Provide Twitter client configuration in server/services/twitter.service.js

```
const client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token: '-',
  access_token_secret: ''
});
```
run with node or nodemon
```
node app.js
nodemon app.js
```