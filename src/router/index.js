import Vue from 'vue'
import Router from 'vue-router'
import RecordWall from '../components/RecordWall.vue'

Vue.use(Router)

export default new Router(
  {
    routes: [
      {
        path: '/',
        name: 'RecordWall',
        component: RecordWall,
        props: (route) => ({
          inputUserId: route.query.user,
          inputCriteria: route.query.sc,
          inputDirection: route.query.sd
        })
      }
    ]
  }
)
