import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.string('email').nullable()
      table.string('description').nullable()
      table.string('invite_code').notNullable().unique()
      table.string('admin_password').notNullable()
      table.string('user_password').notNullable()
      table.boolean('is_expired').defaultTo(false)

      table.timestamp('created_at').defaultTo('NOW()')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
