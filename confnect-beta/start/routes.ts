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

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.get('/', [EventsController, 'get']).use(middleware.auth())
    router.post('/', [EventsController, 'create'])
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
  })
  .prefix('api/v1/questions')
  .use(middleware.auth())
