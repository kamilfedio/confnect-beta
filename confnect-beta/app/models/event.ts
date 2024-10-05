import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Question from './question.js'
import { HasMany } from '@adonisjs/lucid/types/relations'

const AuthFinderAdmin = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['inviteCode'],
  passwordColumnName: 'adminPassword',
})

const AuthFinderUser = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['inviteCode'],
  passwordColumnName: 'userPassword',
})

export default class User extends compose(BaseModel, AuthFinderAdmin, AuthFinderUser) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

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

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @hasMany(() => Question)
  declare questions: HasMany<typeof Question>
}
