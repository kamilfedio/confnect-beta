import mail from '@adonisjs/mail/services/main'

export default class MailerControllerService {
  async sendEmail(email: string, subject: string, text: string) {
    await mail
      .sendLater((message) => {
        message.from('Elo zelo').to(email).subject(subject).text(text)
      })
      .then(() => {
        console.log('email sent')
      })
      .catch((error) => {
        console.log('error sending email', error)
      })
  }
}
