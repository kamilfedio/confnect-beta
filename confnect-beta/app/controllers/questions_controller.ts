import TransmitService from '#services/transmit'
import { createQuestionValidator } from '#validators/question'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class QuestionsController {
  async index({ auth, request, response }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = 10
    const event = await auth.getUserOrFail()
    const questions = await event.related('questions').query().paginate(page, limit)

    return response.ok(questions)
  }

  @inject()
  async store({ auth, request, response }: HttpContext, transmitService: TransmitService) {
    const event = await auth.getUserOrFail()
    const payload = await createQuestionValidator.validate(request.all())
    const question = await event.related('questions').create(payload)

    await transmitService.sendQuestion(event.id, question)

    return response.created(question)
  }

  async show({ auth, request, response }: HttpContext) {
    const event = await auth.getUserOrFail()
    const question = await event
      .related('questions')
      .query()
      .where('id', request.param('id'))
      .firstOrFail()

    return response.ok(question)
  }
}
