# 11-cli

> Effortlessly build command line apps, with compile and run time type-safety by default

## :sparkles: Features

### Fully typed arguments in runtime and dev

### Minimal and simple API

- No sub-commands

### Auto-generated help and version (todo)

### Supported types for flags

- string
- number
- boolean
- enum (todo)

### Auto-complete (todo)

### Automatic runtime type validation and error messages

### Automatic help and version generation by default (todo)

### Navigate help section interactively (todo) (optional)

### Message when CLI version is outdated (todo) (optional)

Use: https://github.com/sindresorhus/latest-version

Runs in a separate thread to now slow down main functionality

### Hints when command is misspelled

### Watch mode (todo)

See how changes to your CLI immediately updates the help section

### Color output (todo)

Can be turned off with flag or environment variable

## Example usage

```ts
import { command, run } from '11-cli'

const commands = [
  command({
    name: 'hello',
    flag: {
      world: { type: 'string' },
    },
    run({ world }) {
      console.log(world)
    },
  }),
]

run(commands)
```

## API

### command

#### name

string

#### run

(runtimeValues) => void

#### flag

Record<string, Flag>

```ts
flag: {
  hello: {
    type: 'string'
  }
}
```

##### type

'string' | 'number' | 'boolean'

##### defaultValue?

string | number | boolean

##### description?

string

##### alias?

string

## Install

```console
npm install 11-cli
```
