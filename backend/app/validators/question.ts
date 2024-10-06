import vine from '@vinejs/vine'

export const createQuestionValidator = vine.compile(
  vine.object({
    context: vine.string().nullable(),
    content: vine.string(),
  })
)
