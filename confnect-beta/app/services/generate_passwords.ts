import generator from 'generate-password'

export default class GeneratePasswordsService {
  generatePasswords() {
    return generator.generateMultiple(2, {
      length: 4,
      numbers: true,
      uppercase: true,
      lowercase: false,
    })
  }

  generateInviteCode() {
    return generator.generate({
      length: 6,
      numbers: true,
      uppercase: true,
      lowercase: false,
    })
  }
}
