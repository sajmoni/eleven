import { expect, test, vi } from 'vitest'
import didYouMean from '../src/didYouMean.js'
import chalk from 'chalk'

test('did-you-mean', () => {
  const consoleMock = vi
    .spyOn(console, 'log')
    .mockImplementation(() => undefined)
  const possibleValues = ['yellow', 'blue', 'green']
  const value = 'red'
  didYouMean(value, possibleValues)
  expect(consoleMock).toHaveBeenLastCalledWith(
    `\nDid you mean?\n${chalk.bold('green')}\n`,
  )
})
