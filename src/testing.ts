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
>(
  schema: Record<
    string,
    {
      flag: Flag
      run: (runtimeValues: {
        [Key in keyof Flag]: ValidTypesMap[Flag[Key]['type']]
      }) => void
    }
  >,
) {
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
  Schema extends Record<
    string,
    {
      flag: Record<
        string,
        | { type: 'string'; defaultValue?: string }
        | { type: 'number'; defaultValue?: number }
        | { type: 'boolean'; defaultValue?: boolean }
      >
      run: (runtimeValues: RunArguments) => void
    }
  >,
  RunArguments extends {
    [FlagKey in keyof Schema[keyof Schema]['flag']]: ValidTypesMap[Schema[keyof Schema]['flag'][FlagKey]['type']]
  },
  RuntimeValues extends {
    [SchemaKey in keyof Schema]: {
      [FlagKey in keyof Schema[SchemaKey]['flag']]: ValidTypesMap[Schema[SchemaKey]['flag'][FlagKey]['type']]
    }
  },
>(schema: Schema, values: RuntimeValues): RuntimeValues {
  for (const [commandKey, commandValue] of objectEntries(values)) {
    for (const [flagKey, value] of objectEntries(commandValue)) {
      // TODO: Ensure this is type-safe
      const item = schema[commandKey]!.flag[flagKey]
      if (!item) {
        throw new Error(`Unknown flag ${flagKey}`)
      }
      const zod = getZod(item.type)
      zod.parse(value)
    }
  }

  return values
}

const schema = define({
  hello: {
    flag: {
      helloString: { type: 'string', defaultValue: 'a default value' },
      helloNumber: { type: 'number', defaultValue: 100 },
      helloBoolean: { type: 'boolean', defaultValue: false },
    },
    run: (runtimeValues) => {
      runtimeValues.helloString
    },
  },
})

const mockRuntimeValues = {
  hello: { helloString: 'world', helloNumber: 42, helloBoolean: true },
}

const result = validateValues(schema, mockRuntimeValues)

result.hello.helloString
result.hello.helloNumber
