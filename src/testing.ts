import { objectEntries } from 'ts-extras'
import { z, ZodNumber, ZodString } from 'zod'

function define<
  Flag extends Record<
    string,
    | { type: ZodString; defaultValue?: string }
    | { type: ZodNumber; defaultValue?: number }
  >,
>(schema: {
  flag: Flag
  run: (runtimeValues: {
    [Key in keyof Flag]: Flag[Key]['type'] extends ZodString ? string : number
  }) => void
}) {
  return schema
}

function validateValues<
  Schema extends {
    flag: Record<
      string,
      | { type: ZodString; defaultValue?: string }
      | { type: ZodNumber; defaultValue?: number }
    >
    run: (runtimeValues: RuntimeValues) => void
  },
  RuntimeValues extends {
    [Key in keyof Schema['flag']]: Schema['flag'][Key]['type'] extends (
      ZodString
    ) ?
      string
    : number
  },
>(schema: Schema, values: RuntimeValues): RuntimeValues {
  for (const [key, value] of objectEntries(values)) {
    const item = schema.flag[key]
    if (!item) {
      throw new Error(`Unknown flag ${key}`)
    }
    item.type.parse(value)
  }

  return values
}

const schema = define({
  flag: {
    helloString: { type: z.string(), defaultValue: 'a default value' },
    helloNumber: { type: z.number(), defaultValue: 100 },
  },
  run: (runtimeValues) => {
    runtimeValues.helloString
  },
})

const mockRuntimeValues = {
  helloString: 'world',
  helloNumber: 42,
}

const result = validateValues(schema, mockRuntimeValues)

result.helloString
result.helloNumber
