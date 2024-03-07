import process from 'node:process'

export default function getArguments() {
  const [nodePath, filePath, ...args] = process.argv
  console.log('nodePath:', nodePath)
  console.log('filePath:', filePath)

  for (const [index, arg] of args.entries()) {
    console.log(`arg ${index}:`, arg)
  }

  // Return this typed
  return args
}
