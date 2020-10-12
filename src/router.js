import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import News from './views/News.vue'
import Author from './views/Author.vue'
import Gravatar from 'vue-gravatar'

Vue.use(Router)
Vue.component('v-gravatar', Gravatar);

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/news/:uuid',
      name: 'News',
      component: News
    },
    {
      path: '/author/:address',
      name: 'Author',
      component: Author
    }
  ]
})
