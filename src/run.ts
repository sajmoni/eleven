import { objectEntries } from 'ts-extras'
import { ZodBoolean, ZodNumber, ZodString, string, z } from 'zod'
import type { ValidTypes, ValidTypesMap } from './type'
import type { Command, FlagType } from './command'
import getArguments from './parse'

function stringToZod(type: ValidTypes): ZodString | ZodNumber | ZodBoolean {
  return {
    string: z.string(),
    number: z.number(),
    boolean: z.boolean(),
  }[type]
}

export function validate<
  Flag extends FlagType,
  Commands extends Command<Flag>[],
  // TODO: Can the type be written like this and does it matter?
  // RuntimeValues extends {
  //   [Key in Commands[number]['name']]: {
  //     [FlagKey in keyof Commands[number]['flag']]: ValidTypesMap[Commands[number]['flag'][FlagKey]['type']]
  //   }
  // },
  RuntimeValues extends Record<
    string,
    Record<string, string | number | boolean>
  >,
>(commands: Commands, values: RuntimeValues): void {
  // There will only be one entry...
  for (const [commandKey, commandFlags] of objectEntries(values)) {
    const command = commands.find((command) => command.name === commandKey)
    if (!command) {
      throw new Error('Unknown command!')
      // TODO: Did you mean?
    }
    for (const [flagKey, flagValue] of objectEntries(commandFlags)) {
      const flag = command.flag[flagKey]
      if (!flag) {
        throw new Error('Unknown flag!')
        // TODO: Did you mean?
      }
      const zod = stringToZod(flag.type)
      // This zod error needs to be tweaked, its not very end user friendly
      zod.parse(flagValue)
    }
  }
}

export type RunCommand<Flag extends FlagType> = {
  name: string
  flag: Flag
  // The type has to be set to any when you pass commands into this (for whatever reason)
  // It doesn't actually matter much (only if you pass in something to run which does not come from "command")
  // TODO: Use the actual real type here
  // run: (runtimeValues: Record<string, string | boolean | number>) => void
  run: any
}

// TODO: Take configuration as second argument?
// Show help and version (default true)
export default function run<
  Flag extends FlagType,
  Commands extends RunCommand<Flag>[],
>(commands: Commands) {
  const args = getArguments()

  // Get the command to run here

  // TODO: This should only validate command flags
  // Throws error on failure, maybe revise?
  validate(commands, args)

  // TODO: Call the run function here

  console.log('running cli!')
}
