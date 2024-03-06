import { objectEntries } from 'ts-extras'
import { z, ZodNumber, ZodString } from 'zod'

type ValidTypes = 'string' | 'number'

type ValidTypesMap = {
  string: string
  number: number
  boolean: boolean
}

function define<
  Flag extends Record<
    string,
    | { type: 'string'; defaultValue?: string }
    | { type: 'number'; defaultValue?: number }
  >,
>(schema: {
  flag: Flag
  run: (runtimeValues: {
    [Key in keyof Flag]: Flag[Key]['type'] extends `string` ? string : number
  }) => void
}) {
  return schema
}

function getZod(type: ValidTypes): ZodString | ZodNumber {
  return {
    string: z.string(),
    number: z.number(),
  }[type]
}

function validateValues<
  Schema extends {
    flag: Record<
      string,
      | { type: 'string'; defaultValue?: string }
      | { type: 'number'; defaultValue?: number }
    >
    run: (runtimeValues: RuntimeValues) => void
  },
  RuntimeValues extends {
    [Key in keyof Schema['flag']]: Schema['flag'][Key]['type'] extends (
      'string'
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
    // TODO: Get zod parser from string type
    const zod = getZod(item.type)
    zod.parse(value)
  }

  return values
}

const schema = define({
  flag: {
    helloString: { type: 'string', defaultValue: 'a default value' },
    helloNumber: { type: 'number', defaultValue: 100 },
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
