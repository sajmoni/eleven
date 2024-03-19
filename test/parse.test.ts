import { expect, test, vi } from 'vitest'

import getArguments from '../src/parse.js'

const nodePath = 'nodePath'
const filePath = 'filePath'

test('getArguments', () => {
  const argString = `${nodePath} ${filePath} hello --world 42`
  const args = getArguments(argString.split(' '))

  expect(args).toEqual({ hello: { world: '42' } })
})
