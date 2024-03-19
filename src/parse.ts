function isFlag(string: string): boolean {
  return string.startsWith('--') || string.startsWith('-')
}

function transformFlag(string: string): string {
  if (string.startsWith('--')) {
    return string.slice(2, string.length)
  } else if (string.startsWith('-')) {
    return string.slice(1, string.length)
  }
  return string
}

// TODO: More strict return type here?
export default function getArguments(
  argString: string[],
): Record<string, Record<string, string | number | boolean>> {
  const [nodePath, filePath, command, ...args] = argString
  console.log('nodePath:', nodePath)
  console.log('filePath:', filePath)

  if (!nodePath || !filePath || !command) {
    throw new Error('Something went wrong parsing arguments')
  }

  let transformedFlags = {}

  for (const [index, arg] of args.entries()) {
    console.log('arg:', arg)
    const nextValue = args[index + 1]

    if (isFlag(arg)) {
      if (nextValue) {
        // @ts-expect-error
        transformedFlags[transformFlag(arg)] = nextValue
      } else {
        // Consider it boolean
        // @ts-expect-error
        transformedFlags[transformFlag(arg)] = true
      }
    }
    console.log(`arg ${index}:`, arg)
  }

  return { [command]: transformedFlags }
}
