import type { ValidTypesMap } from './type'

type SharedFlagFields = {
  description?: string
  alias?: string
}

export type Command<Flag extends FlagType> = {
  name: string
  flag: Flag
  run: (runtimeValues: {
    [Key in keyof Flag]: ValidTypesMap[Flag[Key]['type']]
  }) => void
}

export type FlagType = Record<
  string,
  (
    | { type: 'string'; defaultValue?: string }
    | { type: 'number'; defaultValue?: number }
    | { type: 'boolean'; defaultValue?: boolean }
  ) &
    SharedFlagFields
>

export default function command<Flag extends FlagType>(
  commands: Command<Flag>,
): Command<Flag> {
  return commands
}
