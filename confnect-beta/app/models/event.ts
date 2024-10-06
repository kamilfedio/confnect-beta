import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, beforeSave, column, hasMany } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import QuestionModel from './question.js'
import * as relations from '@adonisjs/lucid/types/relations'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare email: string | null

  @column()
  declare inviteCode: string

  @column({ serializeAs: null })
  declare adminPassword: string

  @column({ serializeAs: null })
  declare userPassword: string

  @column()
  declare isExpired: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(Event)

  @hasMany(() => QuestionModel)
  declare questions: relations.HasMany<typeof QuestionModel>

  @beforeSave()
  public static async hashPasswords(event: Event) {
    if (event.$dirty.adminPassword) {
      event.adminPassword = await hash.make(event.adminPassword)
    }
    if (event.$dirty.userPassword) {
      event.userPassword = await hash.make(event.userPassword)
    }
  }

  public static async verifyCredentials({
    inviteCode,
    password,
    passwordType,
  }: {
    inviteCode: string
    password: string
    passwordType: 'adminPassword' | 'userPassword'
  }) {
    const event = await this.query().where('inviteCode', inviteCode).firstOrFail()

    if (!(await hash.verify(event[passwordType], password))) {
      throw new Error('Invalid credentials')
    }

    return event
  }
}
