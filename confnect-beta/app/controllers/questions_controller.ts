import type { HttpContext } from '@adonisjs/core/http'

export default class QuestionsController {
  async index({ auth, response }: HttpContext) {
    try {
      const event = await auth.getUserOrFail()

      return response.ok(event)
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
