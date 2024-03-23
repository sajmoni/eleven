import { objectEntries } from 'ts-extras'
import { ZodBoolean, ZodNumber, ZodString, z } from 'zod'
import chalk from 'chalk'
import process from 'node:process'

import type { ValidTypes } from './type'
import type { Command as CommandType, FlagType } from './command'
import getArguments from './parse'
import didYouMean from './didYouMean'

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
>(command: Command, commandFlags: RuntimeValues): boolean {
  const allFlagNames = Object.keys(command.flag)

  for (const [flagKey, flagValue] of objectEntries(commandFlags)) {
    const flag = command.flag[flagKey]
    if (!flag) {
      console.log(`\nFlag "${flagKey}" not found`)
      didYouMean(flagKey, allFlagNames)
      return false
    }
    const zod = stringToZod(flag.type)
    const parseResult = zod.safeParse(flagValue)
    if (parseResult.success === false) {
      const error = parseResult.error.issues[0]!
      console.log(
        //TODO: Figure out the types here
        // @ts-expect-error - This actually works although typescript complains
        `\nFlag ${chalk.bold(flagKey)}: expected type ${chalk.bold(error.expected)} but got type ${chalk.bold(error.received)}`,
      )
      return false
    }
  }

  return true
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
  const args = getArguments(process.argv)

  const [commandKey, commandFlags] = Object.entries(args)[0]!

  const command = commands.find((command) => command.name === commandKey)

  if (!command) {
    const allNames = commands.map((command) => command.name)
    console.log(`\nCommand "${commandKey}" not found`)
    didYouMean(commandKey, allNames)
    return
  }

  if (!validateFlags(command, commandFlags)) {
    return
  }

  command.run(commandFlags)
}
