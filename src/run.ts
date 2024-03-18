import { objectEntries } from 'ts-extras'
import { ZodBoolean, ZodNumber, ZodString, z } from 'zod'
import type { ValidTypes } from './type'
import type { Command as CommandType, FlagType } from './command'
import getArguments from './parse'

function stringToZod(type: ValidTypes): ZodString | ZodNumber | ZodBoolean {
  return {
    string: z.string(),
    number: z.number(),
    boolean: z.boolean(),
  }[type]
}

export function validateFlags<
  Flag extends FlagType,
  Command extends CommandType<Flag>,
  // TODO: Can the type be written like this and does it matter?
  // RuntimeValues extends {
  //   [Key in Commands[number]['name']]: {
  //     [FlagKey in keyof Commands[number]['flag']]: ValidTypesMap[Commands[number]['flag'][FlagKey]['type']]
  //   }
  // },
  RuntimeValues extends Record<string, string | number | boolean>,
>(command: Command, commandFlags: RuntimeValues): void {
  for (const [flagKey, flagValue] of objectEntries(commandFlags)) {
    const flag = command.flag[flagKey]
    if (!flag) {
      throw new Error('Unknown flag!')
      // TODO: Did you mean?
    }
    const zod = stringToZod(flag.type)
    // TODO: This zod error needs to be tweaked, its not very end user friendly
    zod.parse(flagValue)
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

  const [commandKey, commandFlags] = Object.entries(args)[0]!

  const command = commands.find((command) => command.name === commandKey)

  if (!command) {
    throw new Error('Unknown command!')
    // TODO: Did you mean?
  }

  // Get the command to run here

  // Throws error on failure, maybe revise?
  validateFlags(command, commandFlags)

  command.run(commandFlags)
}
