<template>
  <div class="container" style="margin-top:40px">
    <vue-headful
      title="CryptoRivista Decentralized News Feed"
      description="Read articles from trusted sources."
    />
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <hr>
        <div v-if="isLoading">Loading news from the blockchain...</div>
        <div v-if="!isLoading">
          <div v-for="news in feed" v-bind:key="news._id" class="feed" style="position:relative; float:none; overflow:hidden">
            <div v-if="news.data !== 'upvote' && news.data !== 'downvote'" style="position:relative">
              <a :href="'/#/news/' + news.uuid" style="position:absolute;bottom:40px; cursor:pointer; right:0;">
                <b-icon-arrow-right class="arrow-dx"></b-icon-arrow-right>
              </a>
              <div v-if="news.data.image && news.data.image.indexOf('file://') === -1 && news.data.image.indexOf('http://') === -1 && news.data.image.indexOf('https://') === 0"><img style="margin-bottom:20px" :src="news.data.image" width="100%"></div>
              <div v-if="!news.data.title">
               <h3 style="margin:0; padding:0; font-size:24px!important; font-weight:bold; padding-right:40px">{{ news.refID }}</h3>
              </div>
              <div v-if="news.data.title">
               <h3 style="margin:0; padding:0; font-size:24px!important; font-weight:bold; padding-right:40px">{{ news.data.title }}</h3>
              </div>
              <div v-if="news.data.tags">
               <span v-for="tag in news.data.tags" v-bind:key="tag" style="margin:0; padding:0; font-size:13px; padding-right:10px">#{{ tag }}</span>
              </div>
              <div style="font-size:14px;" v-if="!news.data.creator">
                Written by <b><a :href="'/#/author/' + news.address">{{ news.address.substr(0,3) }}...{{ news.address.substr(-3) }}</a></b> at block <i>{{ news.block }}</i>
              </div>
              <div style="font-size:14px;" v-if="news.data.creator">
                Written by <b><a :href="'/#/author/' + news.address">{{ news.data.creator }}</a></b> and notarized block <i>{{ news.block }}</i>
              </div>
              <div style="font-size:14px;" v-if="news.data.publisher">
                Published on {{ news.data.pubdate }}
              </div>
              <div style="font-size:14px;" v-if="news.data.domain">
                Original content at <b style="font-size:14px"><a :href="news.data.link" target="_blank">{{ news.data.domain }}</a></b>
              </div>
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
var LZUTF8 = require('lzutf8');
let publishers = require('@/publishers.json')
export default {
  name: 'home',
  mounted : function(){
    this.checkIdaNodes()
  },
  methods: {
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
                    pubkey: '0236480adc4f111ddb097d657f400f71dd0209586ea6a9c9159b7e7dc0be89e9ac',
                    limit: 1000000
                  }).then(async response => {
                    let unique = []
                    for(let x in response.data.data){
                      let nws = response.data.data[x].data
                      if(nws.signature !== undefined){
                        let verify = await app.scrypta.verifyMessage(nws.pubkey, nws.signature, nws.message)
                        if(verify !== false && app.publishers[nws.pubkey] !== undefined){
                          response.data.data[x].data = JSON.parse(response.data.data[x].data.message)
                          response.data.data[x].data.publisher = nws.pubkey
                          if(response.data.data[x].data.version !== undefined && response.data.data[x].data.version === 2){
                            response.data.data[x].data.title = LZUTF8.decompress(response.data.data[x].data.title, { inputEncoding: 'Base64' })
                            response.data.data[x].data.text = LZUTF8.decompress(response.data.data[x].data.compressed, { inputEncoding: 'Base64' })
                            response.data.data[x].data.tags = LZUTF8.decompress(response.data.data[x].data.tags, { inputEncoding: 'Base64' })
                            response.data.data[x].data.tags = JSON.parse(response.data.data[x].data.tags)
                            response.data.data[x].data.time = new Date(response.data.data[x].data.pubdate).getTime()
                            let datesplit = response.data.data[x].data.pubdate.split('T')
                            let datedate = datesplit[0].split('-')
                            let datetime = datesplit[1].split(':')
                            response.data.data[x].data.pubdate = datedate[2] + '/' + datedate[1] + '/' + datedate[0] + ' at ' + datetime[0] + ':' + datetime[1]
                            response.data.data[x].data.guid = LZUTF8.decompress(response.data.data[x].data.guid, { inputEncoding: 'Base64' })
                            response.data.data[x].data.creator = LZUTF8.decompress(response.data.data[x].data.creator, { inputEncoding: 'Base64' })
                            response.data.data[x].data.link = LZUTF8.decompress(response.data.data[x].data.link, { inputEncoding: 'Base64' })
                            response.data.data[x].data.domain = response.data.data[x].data.link.replace('http://','').replace('https://','').split(/[/?#]/)[0];
                            if(unique.indexOf(nws.signature) === -1){
                              unique.push(nws.signature)
                              app.feed.push(response.data.data[x])
                            }
                          }
                        }
                      }
                    }
                    app.feed.sort(function(a, b) {
                      return parseFloat(b.data.time) - parseFloat(a.data.time);
                    });
                    app.isLoading = false
                  })
                }
              }
            }
          )
        }
      }
  },
  data () {
    return {
      scrypta: window.ScryptaCore,
      axios: window.axios,
      nodes: [],
      connected: '',
      publishers: publishers,
      feed: [],
      isLoading: true,
      counters: [],
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
</style>