import define from './define'
import validate from './validate'

const schema = define({
  hello: {
    flag: {
      helloString: { type: 'string', defaultValue: 'a default value' },
      helloNumber: { type: 'number', defaultValue: 100 },
      helloBoolean: { type: 'boolean', defaultValue: false },
    },
    run: (runtimeValues) => {
      runtimeValues.helloString
    },
  },
})

const mockRuntimeValues = {
  hello: { helloString: 'world', helloNumber: 42, helloBoolean: true },
}

const result = validate(schema, mockRuntimeValues)

result.hello.helloString
result.hello.helloNumber
