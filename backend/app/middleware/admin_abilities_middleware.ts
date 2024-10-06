import { HttpContext } from '@adonisjs/core/http'

export default class Abilities {
  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    const { auth, response } = ctx

    try {
      const event = await auth.getUserOrFail()
      const tokenAbilities = event.currentAccessToken.abilities

      if (!tokenAbilities.includes('admin')) {
        return response.unauthorized(
          'You do not have the required abilities to access this resource'
        )
      }

      await next()
    } catch (error) {
      return response.badRequest(error.message)
    }
  }
}
