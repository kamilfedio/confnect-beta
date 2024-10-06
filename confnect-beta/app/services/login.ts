import Event from '#models/event'

export default class LoginService {
  async verifyEventCredentaials({
    inviteCode,
    password,
  }: {
    inviteCode: string
    password: string
  }) {
    let event = await Event.verifyCredentials({
      inviteCode: inviteCode,
      password: password,
      passwordType: 'adminPassword',
    }).catch(() => null)
    if (event) {
      return { event, role: 'admin' }
    }

    event = await Event.verifyCredentials({
      inviteCode: inviteCode,
      password: password,
      passwordType: 'userPassword',
    })

    if (event) {
      return { event, role: 'user' }
    }
    throw new Error('Invalid credentials')
  }
}
