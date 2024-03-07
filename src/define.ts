import type { ValidTypesMap } from './type'

type SharedFlagFields = {
  description?: string
  alias?: string
}

export default function define<
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
