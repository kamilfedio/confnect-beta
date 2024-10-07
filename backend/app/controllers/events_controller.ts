import Event from '#models/event'
import GeneratePasswordsService from '#services/generate_passwords'
import LoginService from '#services/login'
import MailerControllerService from '#services/send_mail'
import {
  createEventLoginValidator,
  createEventUpdateValidator,
  createEventValidator,
} from '#validators/event'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class EventsController {
  async get({ auth, response }: HttpContext) {
    const event = await auth.getUserOrFail()
    return response.ok(event)
  }

  @inject()
  async create(
    { request, response }: HttpContext,
    generatePasswordsService: GeneratePasswordsService,
    mailerControllerService: MailerControllerService
  ) {
    const payload = request.all()
    const { name, description, email } = payload
    const passwords = generatePasswordsService.generatePasswords()
    const inviteCode = generatePasswordsService.generateInviteCode()

    const newPayload = await createEventValidator.validate({
      name: name,
      description: description,
      email: email,
      adminPassword: passwords[0],
      userPassword: passwords[1],
      inviteCode: inviteCode,
    })

    const newEvent = {
      ...newPayload,
      isExpired: false,
    }

    const event = await Event.create(newEvent)
    const token = await Event.accessTokens.create(event, ['admin'], {
      expiresIn: '30 days',
    })

    if (event.email) {
      await mailerControllerService.sendEmail(
        event.email,
        'Hi, your admin password is here',
        `Admin password: ${passwords[0]}, Invite code: ${inviteCode}`
      )
    }

    return response.status(201).json({
      event: { ...event.toJSON(), adminPassword: passwords[0] },
      token: { type: 'bearer', value: token.value!.release(), role: 'admin' },
    })
  }

  @inject()
  async login({ request, response }: HttpContext, loginService: LoginService) {
    const { inviteCode, password } = await createEventLoginValidator.validate(request.all())

    try {
      const { event, role } = await loginService.verifyEventCredentaials({
        inviteCode: inviteCode,
        password: password,
      })
      const token = await Event.accessTokens.create(event, [role], {
        expiresIn: '30 days',
      })
      return response.status(201).json({
        event: event,
        token: { type: 'bearer', value: token.value!.release(), role: role },
      })
    } catch (error) {
      return response.status(401).json({ message: 'Invalid credentials' })
    }
  }

  async update({ auth, request, response }: HttpContext) {
    const data = await createEventUpdateValidator.validate(request.all())
    const event = await auth.getUserOrFail()

    event.merge(transformNullToUndefined(data))
    await event.save()

    return response.ok(event)
  }

  @inject()
  async resetUserPassword(
    { auth, response }: HttpContext,
    generatePasswordsService: GeneratePasswordsService
  ) {
    const event = await auth.getUserOrFail()
    const userPassword = generatePasswordsService.generatePasswords()[0]

    event.merge({ userPassword: userPassword })
    await event.save()
    return response.ok({ userPassword: userPassword })
  }
}

function transformNullToUndefined(data: any) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value === null ? undefined : value])
  )
}
