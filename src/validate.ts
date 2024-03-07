import { objectEntries } from 'ts-extras'
import { ZodBoolean, ZodNumber, ZodString, z } from 'zod'
import type { ValidTypes, ValidTypesMap } from './type'

function getZod(type: ValidTypes): ZodString | ZodNumber | ZodBoolean {
  return {
    string: z.string(),
    number: z.number(),
    boolean: z.boolean(),
  }[type]
}

export default function validate<
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
