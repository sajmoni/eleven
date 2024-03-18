import command from './src/command'
import run from './src/run'

const commands = [
  command({
    name: 'hello',
    flag: {
      helloString: { type: 'string', defaultValue: 'a default value' },
      helloNumber: { type: 'number', defaultValue: 100 },
      helloBoolean: { type: 'boolean', defaultValue: false },
    },
    run: (runtimeValues) => {
      console.log('running the command hello:', runtimeValues.helloString)
    },
  }),
  command({
    name: 'world',
    flag: {
      worldString: { type: 'string', defaultValue: 'a default value' },
      worldNumber: { type: 'number', defaultValue: 100 },
      worldBoolean: { type: 'boolean', defaultValue: false },
    },
    run: (runtimeValues) => {
      runtimeValues.worldString
    },
  }),
]

run(commands)
