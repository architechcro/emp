const Twitter = require('twit');
const client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token: '-',
  access_token_secret: ''
});
const {
  MoleculerError
} = require("moleculer").Errors;
let cache = [];
let cacheAge = 0;
module.exports = {
  // Name
  name: "twitter",
  // Version
  //  version: 1,

  // Settings
  // settings: {},
  // Metadata
  // metadata: {},
  // Dependencies
  // dependencies: [],

  // Actions
  actions: {
    // Shorthand actions
    hello() {
      // Call a method
      this.doSomething();

      return "Hello Moleculer";
    },
   user(ctx) {
        console.log('Service TW Request >>>>>>>>>>');
        return this.Promise.resolve()
        .then(() =>{
          return this.user()
            .then( result => {
              this.logger.debug('user method restult', result);
               return result;
            })
            .catch( err => {
              this.logger.error('Twitter user error', err)
              throw new Error(err);
            });
        })

    },
    usertw(ctx) {
      return client
      .get('account/verify_credentials')
      .then(user => {
        this.logger.debug('usertw results from twitter', user);
        return user;
      })
      .catch( error => {
        throw new MoleculerError(error);
      });
    },
    home: {
      params: {
        since: {
          type: "number",
          optional: true,
          convert: true
        }
      },
      async handler(ctx, req, res) {
        if (Date.now() - cacheAge > 60000) {
          cacheAge = Date.now();
          const params = {
            tweet_mode: 'extended',
            count: 200
          };
          if (ctx.params.since) {
            params.since = ctx.params.since;
          }
          res = await client
            .get(`statuses/home_timeline`, params)
            .then(timeline => {
              this.logger.debug('returning timeline');
              cache = timeline;
              return timeline;
            })
            .catch(error => {
              return Promise.reject(new MoleculerError(error));
            });
        } else {
          res = cache;
        }
        this.logger.debug('returning home result ', res);
        return res;
      }
    },
    // With properties
    welcome: {
      // Cache options
      cache: {
        keys: ["name"]
      },
      // Validation options
      params: {
        name: "string"
      },
      // Action handler
      handler(ctx) {
        return `Welcome, ${ctx.params.name}`;
      }
    }
  },

  events: {
    "user.created" (payload, sender) {
      this.logger.debug('user event emited');
    }
  },

  // Service methods
  methods: {
    doSomething() {
      console.log('something');
    },
    user(){
      this.logger.debug('User method called');
      return new Promise((resolve,reject) => {
        client
        .get('account/verify_credentials')
        .then(user => {
          this.logger.debug('user results from twitter');
          resolve(user);
        })
        .catch( error => {
          reject(new MoleculerError(error));
        });
      })
    }
  },

  // Lifecycle event handlers
  created() {
    this.logger.debug('Twitter service creates')
    console.log("Twitter Service created");
  },

  started() {
    console.log("Twitter Service started");
    return Promise.resolve();
  },

  stopped() {
    console.log("Twitter Service stopped");
    return Promise.resolve();
  }
};
