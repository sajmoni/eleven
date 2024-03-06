import { objectEntries } from 'ts-extras'
import { z, ZodBoolean, ZodNumber, ZodString } from 'zod'

type ValidTypes = 'string' | 'number' | 'boolean'

type ValidTypesMap = {
  string: string
  number: number
  boolean: boolean
}

type SharedFlagFields = {
  description?: string
  alias?: string
}

function define<
  Flag extends Record<
    string,
    (
      | { type: 'string'; defaultValue?: string }
      | { type: 'number'; defaultValue?: number }
      | { type: 'boolean'; defaultValue?: boolean }
    ) &
      SharedFlagFields
  >,
>(schema: {
  flag: Flag
  run: (runtimeValues: {
    [Key in keyof Flag]: ValidTypesMap[Flag[Key]['type']]
  }) => void
}) {
  return schema
}

function getZod(type: ValidTypes): ZodString | ZodNumber | ZodBoolean {
  return {
    string: z.string(),
    number: z.number(),
    boolean: z.boolean(),
  }[type]
}

function validateValues<
  Schema extends {
    flag: Record<
      string,
      | { type: 'string'; defaultValue?: string }
      | { type: 'number'; defaultValue?: number }
      | { type: 'boolean'; defaultValue?: boolean }
    >
    run: (runtimeValues: RuntimeValues) => void
  },
  RuntimeValues extends {
    [Key in keyof Schema['flag']]: ValidTypesMap[Schema['flag'][Key]['type']]
  },
>(schema: Schema, values: RuntimeValues): RuntimeValues {
  for (const [key, value] of objectEntries(values)) {
    const item = schema.flag[key]
    if (!item) {
      throw new Error(`Unknown flag ${key}`)
    }
    const zod = getZod(item.type)
    zod.parse(value)
  }

  return values
}

const schema = define({
  flag: {
    helloString: { type: 'string', defaultValue: 'a default value' },
    helloNumber: { type: 'number', defaultValue: 100 },
    helloBoolean: { type: 'boolean', defaultValue: false },
  },
  run: (runtimeValues) => {
    runtimeValues.helloString
  },
})

const mockRuntimeValues = {
  helloString: 'world',
  helloNumber: 42,
  helloBoolean: true,
}

const result = validateValues(schema, mockRuntimeValues)

result.helloString
result.helloNumber
