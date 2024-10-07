/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const EventsController = () => import('#controllers/events_controller')
const QuestionsController = () => import('#controllers/questions_controller')
import transmit from '@adonisjs/transmit/services/main'

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import { throttle } from './limiter.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.get('/', [EventsController, 'get']).use([middleware.auth()]) // throttle
    router.post('/', [EventsController, 'create']).use([throttle])
    router.post('/join', [EventsController, 'login'])
    router
      .patch('/', [EventsController, 'update'])
      .use([middleware.auth(), middleware.adminAbilities()])
    router
      .patch('/reset-password', [EventsController, 'resetUserPassword'])
      .use([middleware.auth(), middleware.adminAbilities()])
  })
  .prefix('api/v1/events')

router
  .group(() => {
    router.get('/', [QuestionsController, 'index'])
    router.get('/:id', [QuestionsController, 'show'])
    router.post('/', [QuestionsController, 'store']).use([throttle])
  })
  .prefix('api/v1/events/questions')
  .use(middleware.auth())

transmit.registerRoutes((route) => route.middleware(middleware.auth()).prefix('api/v1/events'))
