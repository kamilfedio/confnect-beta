import vine from '@vinejs/vine'

export const createEventValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50),
    description: vine.string().maxLength(255).nullable(),
    email: vine.string().email().nullable(),
    inviteCode: vine
      .string()
      .maxLength(6)
      .minLength(6)
      .unique(async (db, value) => !(await db.from('events').where('invite_code', value).first())),
    adminPassword: vine.string().minLength(4).maxLength(4),
    userPassword: vine.string().minLength(4).maxLength(4),
  })
)

export const createEventLoginValidator = vine.compile(
  vine.object({
    inviteCode: vine.string().maxLength(6).minLength(6),
    password: vine.string().minLength(4).maxLength(4),
  })
)

export const createEventUpdateValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50).nullable(),
    description: vine.string().maxLength(255).nullable(),
    email: vine.string().email().nullable(),
  })
)
