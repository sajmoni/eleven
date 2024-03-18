import { closest } from 'fastest-levenshtein'
import chalk from 'chalk'

export default function didYouMean<T extends string>(
  value: string,
  possibleValues: T[],
): void {
  const result = closest(value, possibleValues)
  console.log(`\nDid you mean?\n${chalk.bold(result)}\n`)
}
