import process from 'node:process'

// TODO: More strict return type here?
export default function getArguments(): Record<
  string,
  Record<string, string | number | boolean>
> {
  const [nodePath, filePath, ...args] = process.argv
  console.log('nodePath:', nodePath)
  console.log('filePath:', filePath)

  for (const [index, arg] of args.entries()) {
    console.log(`arg ${index}:`, arg)
  }

  const mockRuntimeValues = {
    hello: { helloString: '42', helloNumber: 42, helloBoolean: true },
  }

  return mockRuntimeValues
}
