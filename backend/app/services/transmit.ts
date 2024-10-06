import Question from '#models/question'
import transmit from '@adonisjs/transmit/services/main'

export default class TransmitService {
  async sendQuestion(id: number, question: Question) {
    transmit.broadcast(`events/${id}/questions`, { question: question.toJSON() })
  }
}
