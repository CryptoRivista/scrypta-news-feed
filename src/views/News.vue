<template>
  <div>
    <vue-headful
      v-if="news.data !== undefined"
      :title="news.data.title"
      :description="news.data.subtitle"
    />
  
    <div class="container" style="margin-top: 40px">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <hr>
          <div v-if="isLoading">Loading news from the blockchain...</div>
          <div v-if="!isLoading" class="news-head">
            <div v-if="!news.data.title">
              <h1 style="margin: 0; padding: 0; margin-bottom: -30px">
                {{ news.refID }}
              </h1>
              <br />
            </div>
            <div v-if="news.data.title">
              <h1 style="margin: 0; padding: 0; margin-bottom: -30px">
                {{ news.data.title }}
              </h1>
              <br /><br >
            </div>
            <div v-if="news.data.subtitle">
              <h3 style="margin: 0; padding: 0; margin-bottom: -30px">
                {{ news.data.subtitle }}
              </h3>
              <br />
            </div>
            <div v-if="news.data.tags">
              <span
                v-for="tag in news.data.tags"
                v-bind:key="tag"
                style="margin: 0; padding: 0; padding-right: 10px"
                >#{{ tag }}</span
              >
            </div>
            <div
              v-if="
                news.data.image &&
                news.data.image.indexOf('file://') === -1 &&
                news.data.image.indexOf('http://') === -1 &&
                news.data.image.indexOf('https://') === 0
              "
            >
              <br />
              <img :src="news.data.image" width="100%" />
            </div>
            <div style="font-size: 15px; margin-top: 0px">
              <v-gravatar
                :email="news.address"
                height="80"
                style="margin-right: 20px; margin-top: 28px; float: left"
              /><br />

              <div v-if="!news.data.creator">
                Written by
                <b
                  ><a :href="'/#/author/' + news.address"
                    >{{ news.address.substr(0, 3) }}...{{
                      news.address.substr(-3)
                    }}</a
                  ></b
                >
                at block <i>{{ news.block }}</i>
              </div>
              <div v-if="news.data.creator">
                Written by
                <b
                  ><a :href="'/#/author/' + news.address">{{
                    news.data.creator
                  }}</a></b
                >
                at block <i>{{ news.block }}</i>
                <br>Published on  <i>{{ news.data.pubdate }}</i><br />
              </div>
            </div>
            Timestamped on {{ time }}<br />
            <a
              :href="'https://proof.scryptachain.org/#/uuid/' + news.uuid"
              target="_blank"
            >
              Show Proof of Existence <b-icon-arrow-right></b-icon-arrow-right>
            </a>
            <hr />

            <div style="font-size: 13px" v-if="news.data.link">
              Original content parsed from:<br />
              <b style="font-size: 13px"
                ><a :href="news.data.link" target="_blank">{{
                  news.data.link
                }}</a></b
              >
              <hr />
            </div>
              <div class="sharing-buttons">
                <h5>Share on:</h5>
                <ShareNetwork
                    network="facebook"
                    :url="'https://news.scryptachain.org/#/news/' + news.uuid"
                    :title="news.data.title"
                    :description="
                      news.data.text.replace(/<\/?[^>]+(>|$)/g, '').substr(0, 255) +
                      '...'
                    "
                    :quote="news.data.subtitle"
                    :hashtags="news.data.tagsline"
                  >
                    <b-button>Facebook</b-button>
                </ShareNetwork>
                <ShareNetwork
                    network="twitter"
                    :url="'https://news.scryptachain.org/#/news/' + news.uuid"
                    :title="news.data.title"
                    :description="
                      news.data.text.replace(/<\/?[^>]+(>|$)/g, '').substr(0, 255) +
                      '...'
                    "
                    :quote="news.data.subtitle"
                    :hashtags="news.data.tagsline"
                  >
                    <b-button>Twitter</b-button>
                </ShareNetwork>
                <ShareNetwork
                    network="telegram"
                    :url="'https://news.scryptachain.org/#/news/' + news.uuid"
                    :title="news.data.title"
                    :description="
                      news.data.text.replace(/<\/?[^>]+(>|$)/g, '').substr(0, 255) +
                      '...'
                    "
                    :quote="news.data.subtitle"
                    :hashtags="news.data.tagsline"
                  >
                    <b-button>Telegram</b-button>
                </ShareNetwork>
                <ShareNetwork
                    network="linkedin"
                    :url="'https://news.scryptachain.org/#/news/' + news.uuid"
                    :title="news.data.title"
                    :description="
                      news.data.text.replace(/<\/?[^>]+(>|$)/g, '').substr(0, 255) +
                      '...'
                    "
                    :quote="news.data.subtitle"
                    :hashtags="news.data.tagsline"
                  >
                    <b-button>Linkedin</b-button>
                </ShareNetwork>
                <ShareNetwork
                    network="reddit"
                    :url="'https://news.scryptachain.org/#/news/' + news.uuid"
                    :title="news.data.title"
                    :description="
                      news.data.text.replace(/<\/?[^>]+(>|$)/g, '').substr(0, 255) +
                      '...'
                    "
                    :quote="news.data.subtitle"
                    :hashtags="news.data.tagsline"
                  >
                    <b-button>Reddit</b-button>
                </ShareNetwork>
                <ShareNetwork
                    network="whatsapp"
                    :url="'https://news.scryptachain.org/#/news/' + news.uuid"
                    :title="news.data.title"
                    :description="
                      news.data.text.replace(/<\/?[^>]+(>|$)/g, '').substr(0, 255) +
                      '...'
                    "
                    :quote="news.data.subtitle"
                    :hashtags="news.data.tagsline"
                  >
                    <b-button>Whatsapp</b-button>
                </ShareNetwork>
              </div>
            <hr />
            <hr />
            <div v-if="!news.data.text">
              <div class="news news-text" v-html="news.data"></div>
            </div>
            <div v-if="news.data.text">
              <div class="news news-text" v-html="news.data.text"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="node-badge" v-if="connected">{{ connected }}</div>
    </div>
  </div>
</template>


<script>
var LZUTF8 = require("lzutf8");
let publishers = require("@/publishers.json");
export default {
  name: "home",
  mounted: function () {
    this.checkIdaNodes();
    this.checkUser();
  },
  methods: {
    async checkUser() {
      const app = this;
      let user = await app.scrypta.keyExist();
      if (user.length === 34) {
        app.user = user;
      }
    },
    async checkIdaNodes() {
      var checknodes = this.scrypta.returnNodes();
      const app = this;
      for (var i = 0; i < checknodes.length; i++) {
        this.axios.get(checknodes[i] + "/wallet/getinfo").then((check) => {
          if (check.data.blocks !== undefined) {
            if (app.connected === "") {
              app.connected = check.config.url.replace("/wallet/getinfo", "");
              app.axios
                .post(app.connected + "/read", {
                  uuid: app.$route.params.uuid,
                })
                .then(async (response) => {
                  app.news = response.data.data[0];
                  if (app.news.data.signature !== undefined) {
                    let verify = await app.scrypta.verifyMessage(
                      app.news.data.pubkey,
                      app.news.data.signature,
                      app.news.data.message
                    );
                    if (verify !== false) {
                      let publisher = app.news.data.pubkey;
                      app.news.data = JSON.parse(
                        response.data.data[0].data.message
                      );
                      app.news.data.publisher = publisher;
                      app.news.data.title = LZUTF8.decompress(
                        app.news.data.title,
                        { inputEncoding: "Base64" }
                      );
                      app.news.data.text = LZUTF8.decompress(
                        app.news.data.compressed,
                        { inputEncoding: "Base64" }
                      );
                      app.news.data.tags = LZUTF8.decompress(
                        app.news.data.tags,
                        { inputEncoding: "Base64" }
                      );
                      app.news.data.time = new Date(app.news.data.pubdate).getTime()
                      let datesplit = app.news.data.pubdate.split('T')
                      let datedate = datesplit[0].split('-')
                      let datetime = datesplit[1].split(':')
                      app.news.data.pubdate = datedate[2] + '/' + datedate[1] + '/' + datedate[0] + ' at ' + datetime[0] + ':' + datetime[1]
                      
                      app.news.data.tags = JSON.parse(app.news.data.tags);
                      app.news.data.guid = LZUTF8.decompress(
                        app.news.data.guid,
                        { inputEncoding: "Base64" }
                      );
                      app.news.data.creator = LZUTF8.decompress(
                        app.news.data.creator,
                        { inputEncoding: "Base64" }
                      );
                      app.news.data.link = LZUTF8.decompress(
                        app.news.data.link,
                        { inputEncoding: "Base64" }
                      );
                    }
                  } else {
                    if (app.news.data.title !== undefined) {
                      app.news.data.title = LZUTF8.decompress(
                        app.news.data.title,
                        { inputEncoding: "Base64" }
                      );
                      app.news.data.subtitle = LZUTF8.decompress(
                        app.news.data.subtitle,
                        { inputEncoding: "Base64" }
                      );
                      app.news.data.image = LZUTF8.decompress(
                        app.news.data.image,
                        { inputEncoding: "Base64" }
                      );
                      app.news.data.text = LZUTF8.decompress(
                        app.news.data.text,
                        { inputEncoding: "Base64" }
                      );
                      if (app.news.data.tags !== undefined) {
                        app.news.data.tags = LZUTF8.decompress(
                          app.news.data.tags,
                          { inputEncoding: "Base64" }
                        );
                        app.news.data.tags = JSON.parse(app.news.data.tags);
                      } else {
                        app.news.data.tags = [];
                      }
                    } else {
                      app.news.data = LZUTF8.decompress(app.news.data, {
                        inputEncoding: "Base64",
                      });
                    }
                  }
                  app.news.data.tagsline = ''
                  for(let t in app.news.data.tags){
                    if(t !== 0){
                      app.news.data.tagsline += ','
                    }
                    app.news.data.tagsline += app.news.data.tags[t]
                  }
                  app.time = new Date(app.news.time * 1000).toUTCString();
                  app.isLoading = false;
                  app.readCounters();
                });
            }
          }
        });
      }
    },
    async upvote() {
      if (this.unlockPwd !== "") {
        var app = this;
        app.decrypted_wallet = "WALLET LOCKED";
        app.scrypta.readKey(this.unlockPwd).then(function (response) {
          if (response !== false) {
            app.isUploading = true;
            let message = "upvote";
            let public_address = app.scrypta.PubAddress;
            let encrypted_wallet = app.scrypta.RAWsAPIKey;
            let protocol = "news://";
            let refID = app.$route.params.uuid;

            app.scrypta
              .write(
                app.unlockPwd,
                message,
                "",
                refID,
                protocol,
                public_address + ":" + encrypted_wallet
              )
              .then((res) => {
                app.isUploading = false;
                if (res.uuid !== undefined) {
                  alert("Upvote sent! Wait at least 2 minutes to see it!");
                  app.showUpvoteModal = false;
                } else {
                  alert("Something goes wrong, retry!");
                }
              });
          } else {
            alert("Wrong password!");
          }
        });
      } else {
        alert("Write your password first");
      }
    },
    async downvote() {
      if (this.unlockPwd !== "") {
        var app = this;
        app.decrypted_wallet = "WALLET LOCKED";
        app.scrypta.readKey(this.unlockPwd).then(function (response) {
          if (response !== false) {
            app.isUploading = true;
            let message = "downvote";
            let public_address = app.scrypta.PubAddress;
            let encrypted_wallet = app.scrypta.RAWsAPIKey;
            let protocol = "news://";
            let refID = app.$route.params.uuid;

            app.scrypta
              .write(
                app.unlockPwd,
                message,
                "",
                refID,
                protocol,
                public_address + ":" + encrypted_wallet
              )
              .then((res) => {
                app.isUploading = false;
                if (res.uuid !== undefined) {
                  alert("Downvote sent! Wait at least 2 minutes to see it!");
                  app.showDownvoteModal = false;
                } else {
                  alert("Something goes wrong, retry!");
                }
              });
          } else {
            alert("Wrong password!");
          }
        });
      } else {
        alert("Write your password first");
      }
    },
    async tip() {
      const app = this;
      if (app.unlockPwd !== "" && app.amountTip > 0) {
        app.decrypted_wallet = "WALLET LOCKED";
        app.scrypta.readKey(this.unlockPwd).then(function (response) {
          if (response !== false) {
            app.isUploading = true;
            let public_address = app.scrypta.PubAddress;
            let encrypted_wallet = app.scrypta.RAWsAPIKey;
            app.axios
              .get(app.connected + "/balance/" + public_address)
              .then((response) => {
                if (response.data.balance > app.amountTip) {
                  app.scrypta
                    .send(
                      app.unlockPwd,
                      app.news.address,
                      parseFloat(app.amountTip),
                      "",
                      public_address + ":" + encrypted_wallet
                    )
                    .then((res) => {
                      app.showTipModal = false;
                      app.isUploading = false;
                      if (res.length === 64) {
                        alert("Tip sent!");
                      } else {
                        alert("Something goes wrong, retry!");
                      }
                    });
                } else {
                  alert("Not enough balance!");
                }
              });
          } else {
            alert("Wrong password!");
          }
        });
      } else {
        alert("Write your password and the amount first");
      }
    },
    openTip() {
      const app = this;
      app.showTipModal = true;
    },
    openDownvote() {
      const app = this;
      app.showDownvoteModal = true;
    },
    openUpvote() {
      const app = this;
      app.showUpvoteModal = true;
    },
    async readCounters() {
      const app = this;
      app.upvotes = 0;
      app.downvotes = 0;
      let votes = await app.axios.post(app.connected + "/read", {
        protocol: "news://",
        refID: app.news.uuid,
      });
      for (let x in votes.data.data) {
        if (app.voters[app.news.uuid] === undefined) {
          app.voters[app.news.uuid] = {};
        }
        if (
          app.voters[app.news.uuid][votes.data.data[x].address] === undefined
        ) {
          if (votes.data.data[x].data === "upvote") {
            app.upvotes++;
            app.voters[app.news.uuid][votes.data.data[x].address] = "upvote";
          } else if (votes.data.data[x].data === "downvote") {
            app.downvotes++;
            app.voters[app.news.uuid][votes.data.data[x].address] = "downvote";
          }
        }
      }
    },
  },
  data() {
    return {
      upvotes: 0,
      downvotes: 0,
      showTipModal: false,
      showUpvoteModal: false,
      showDownvoteModal: false,
      isUploading: false,
      publishers: publishers,
      scrypta: window.ScryptaCore,
      axios: window.axios,
      nodes: [],
      connected: "",
      time: "",
      news: [],
      isLoading: true,
      amountTip: 0,
      unlockPwd: "",
      user: "",
      voters: {},
    };
  },
};
</script>

<style>
.sharing-buttons .btn {
  margin-right: 10px;
  display: inline-block;
}
.node-badge {
  position: fixed;
  bottom: -3px;
  font-size: 10px;
  padding: 8px;
  right: 10px;
  z-index: 9999;
}
.news img {
  max-width: 100%;
}
</style>