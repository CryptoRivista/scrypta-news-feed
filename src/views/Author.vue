<template>
  <div class="container" style="margin-top:40px">
    <div class="row">
      <div class="col-12">
        <v-gravatar :email="author" height="70" style="margin-right:20px; margin-top:0px; float:left" />
        <h4 class="author">{{ author }}</h4>
        <h5>
          {{ identities.length }} verified identities
          <div style="float:right; text-align:right; width:30%; display:inline-block">
            <span v-for="identity in identities" v-bind:key="identity._id">
              <a :href="'https://proof.scryptachain.org/#/uuid/' + identity.uuid" target="_blank">
                <img src="../assets/twitter.svg" height="25" v-if="identity.refID === 'TWITTER'">
                <img src="../assets/linkedin.svg" style="margin-left:10px" height="25" v-if="identity.refID === 'LINKEDIN'">
                <img src="../assets/github.svg" style="margin-left:10px" height="25" v-if="identity.refID === 'GITHUB'">
                <img src="../assets/google-plus.svg" style="margin-left:10px" height="25" v-if="identity.refID === 'GOOGLE'">
                <img src="../assets/mail.svg" height="25" style="margin-left:10px" v-if="identity.refID === 'EMAIL'">
                <img src="../assets/iphone.svg" height="25" style="margin-left:10px" v-if="identity.refID === 'PHONE'">
              </a>
            </span>
          </div>
        </h5>
        <hr>
        <div v-if="isLoading">Loading author's news from the blockchain...</div>
        <div v-if="!isLoading">
          <div v-for="news in feed" v-bind:key="news._id" class="feed" style="position:relative">
            <div v-if="news.data !== 'upvote' && news.data !== 'downvote'">
              <h2 style="margin:0; padding:0;">{{ news.refID }}</h2>
              <div style="font-size:15px;">Written at block <i>{{ news.block }}</i></div>
              <div v-if="counters">
                <div v-for="counter in counters" v-bind:key="counter.uuid">
                  <div v-if="counter.uuid === news.uuid">
                    <b><b-icon-arrow-up></b-icon-arrow-up> {{ counter.upvotes }}</b> UPVOTES
                    <b><b-icon-arrow-down></b-icon-arrow-down> {{ counter.downvotes }}</b> DOWNVOTES
                  </div>
                </div>
              </div>
              <a :href="'/#/news/' + news.uuid">
                <b-icon-arrow-right class="arrow-dx"></b-icon-arrow-right>
              </a>
              <hr>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="node-badge" v-if="connected">{{ connected }}</div>
  </div>
</template>

<script>

export default {
  name: 'home',
  mounted : async function(){
    const app = this
    app.checkIdaNodes()
    app.checkUser()
    app.author = app.$route.params.address
  },
  methods: {
      async checkUser(){
        const app = this
        let user = await app.scrypta.keyExist()
        if(user.length === 34){
          app.user = user
        }
      },
      async checkIdaNodes(){
        var checknodes = this.scrypta.returnNodes()
        const app = this
        for(var i = 0; i < checknodes.length; i++){
          this.axios.get(checknodes[i] + '/wallet/getinfo').then(
            check => {
              if(check.data.blocks !== undefined){
                if(app.connected === ''){
                  app.connected = check.config.url.replace('/wallet/getinfo','')
                  app.axios.post(app.connected + '/read', {
                    protocol: 'news://',
                    address: app.author
                  }).then(response => {
                    app.feed = response.data.data
                    app.readCounters()
                    app.isLoading = false
                  })
                  app.axios.post(app.connected + '/read', {
                    protocol: 'I://',
                    address: app.author
                  }).then(async result => {
                    app.identities = result.data.data
                  })
                }
              }
            }
          )
        }
      },
      async readCounters(){
        const app = this
        for(let y in app.feed){
          let votes = await app.axios.post(app.connected + '/read',{ protocol: 'news://', refID: app.feed[y].uuid })
          let upvotes = 0
          let downvotes = 0
          for(let x in votes.data.data){
            if(app.voters[app.feed[y].uuid] === undefined){
              app.voters[app.feed[y].uuid] = {}
            }
            if(app.voters[app.feed[y].uuid][votes.data.data[x].address] === undefined){
              if(votes.data.data[x].data === 'upvote'){
                upvotes++
                app.voters[app.feed[y].uuid][votes.data.data[x].address] = 'upvote'
              }else if(votes.data.data[x].data === 'downvote'){
                downvotes++
                app.voters[app.feed[y].uuid][votes.data.data[x].address] = 'downvote'
              }
            }
          }
          app.counters.push({
            'uuid': app.feed[y].uuid,
            'upvotes': upvotes,
            'downvotes': downvotes
          })
        }
      }
  },
  data () {
    return {
      scrypta: window.ScryptaCore,
      axios: window.axios,
      nodes: [],
      connected: '',
      feed: [],
      author: '',
      isLoading: true,
      identities: [],
      counters: [],
      user: '',
      voters: {}
    }
  }
}
</script>

<style>
  .node-badge{
    position:fixed; bottom:-3px; font-size:10px; padding:8px; right:10px; z-index:9999;
  }
  .feed img{
    max-width:100%
  }
  .arrow-dx{
    color:#000;
    font-size:60px!important;
    position:absolute;
    top:-10px;
    right:0;
  }
</style>