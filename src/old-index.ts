import {
  ZodBoolean,
  ZodNumber,
  ZodString,
  z,
} from 'zod'
import type { XOR } from 'ts-xor'
import { objectEntries, objectFromEntries } from 'ts-extras'
import { mapToObj, mapValues } from 'remeda'

import getArguments from './parse'

type Command<
  FlagDefinitionType extends ZodString | ZodNumber | ZodBoolean,
  FlagName extends string,
  FlagValue,
> = {
  // TODO: Make this non-optional?
  description?: string
  // Type should be Key -> Value
  run: (flag: Record<FlagName, FlagValue>) => void
  flag?: Record<FlagName, FlagDefinition<FlagDefinitionType>>
}

type Positional = {
  name?: string
  // TODO: Use Zod types here
  type: 'string'
}

type FlagDefinition<
  FlagDefinitionType extends ZodString | ZodNumber | ZodBoolean,
> = {
  // TODO: Use Zod types here
  // string | number | boolean | list? | enum
  type: FlagDefinitionType
  default?: z.infer<FlagDefinitionType>
  alias?: string
}

type Definition<
  FlagDefinitionType extends ZodString | ZodNumber | ZodBoolean,
  FlagName extends string,
  FlagValue,
> = {
  command: Record<string, Command<FlagDefinitionType, FlagName, FlagValue>>
  positional?: Record<string, Positional>
  flag?: Record<string, FlagDefinition<FlagDefinitionType>>
}

export function define<
  FlagDefinitionType extends ZodString | ZodNumber | ZodBoolean,
  FlagName extends string,
  FlagValue,
>(
  definition: Definition<FlagDefinitionType, FlagName, FlagValue>,
): Definition<FlagDefinitionType, FlagName, FlagValue> {
  return definition
}

export function run<
  FlagDefinitionType extends ZodString | ZodNumber | ZodBoolean,
  FlagName extends string,
  FlagValue,
>(definition: Definition<FlagDefinitionType, FlagName, FlagValue>) {
  const runtimeArgs = getArguments()
  console.log('run ~ args:', runtimeArgs)

  if (runtimeArgs[0]) {
    const command = definition.command[runtimeArgs[0]]
    // getFlags()
    if (!command) {
      // TODO: Show helpful message with suggestions of which command to run
      throw new Error('Command is incorrect!')
    }
    // TODO: Check that flag types are correct
    function getFlags() {
      const returnValue = {} as Record<FlagName, string | number | boolean>

      if (!command || !command!.flag) {
        return returnValue
      }

      const flagArgs = runtimeArgs.slice(1, runtimeArgs.length)
      for (const [index, flagArg] of flagArgs.entries()) {
        // Remove the double dash
        // TODO: Handle alias
        const flag = flagArg.slice(2, flagArg.length)
        const flagDefinition = command.flag[flag as FlagName]
        if (!flagDefinition) {
          throw new Error(`Unknown flag: ${flag}`)
        }
        // function getZodStuff(flagDefinition: any) {
        //   if (flagDefinition.type === 'string') {
        //     return z.string()
        //   }
        //   if (flagDefinition.type === 'number') {
        //     return z.number()
        //   }
        //   if (flagDefinition.type === 'boolean') {
        //     return z.boolean()
        //   }
        //   throw new Error(`Unknown type for: ${flag}`)
        // }

        // const zodStuff = getZodStuff(flagDefinition) as unknown
        // TODO: Use the actual value here instead of the flag
        const value = flag as z.infer<typeof flagDefinition.type>
        returnValue[flag] = value
      }

      return returnValue
    }

    command.run(getFlags())
  }

  // Check which command was run and run it

  // Check if the type of args is correct

  // If help
  // console.log('Output based on cli')
  // If version
  // console.log('version 1.0')
}

function foo<const Key extends string, const Value extends string | number>(
  bar: Record<Key, Value>,
) {
  const returnValue = objectFromEntries(
    objectEntries(bar).map(([key, value]) => {
      if (typeof value === 'string') {
        return [key, value as string]
      }
      if (typeof value === 'number') {
        return [key, value as number]
      }
      return [key, value]
    }),
  )

  return returnValue
}

// const baz = z.object({
//   aNumber: z.number(),
//   aString: z.string(),
// })

const actualInput = {
  aNumber: 42,
  aString: 'abc',
}

function getTypedObject<
  const Key extends string,
  const Value extends { type: XOR<'string', 'number'> },
>(
  // object: Readonly<Record<Key, { type: XOR<'string', 'number'> }>>,
  object: Readonly<Record<Key, Value>>,
) {
  // const returnValue = objectFromEntries(
  //   objectEntries(object).map(([key, value]) => {
  //     if (value === 'string') {
  //       return [key, z.string()]
  //     }
  //     if (value === 'number') {
  //       return [key, z.number()]
  //     }
  //     throw new Error('Boo!')
  //   }),
  // )
  // const object = {
  //   aNumber: 'number',
  //   aString: 'string',
  // } as const

  // const foo = pipe(
  //   object,
  //   toPairs.strict,
  //   map(([key, value]) => {
  //     if (value === 'string') {
  //       return [key, z.string()]
  //     }
  //     if (value === 'number') {
  //       return [key, z.number()]
  //     }
  //     throw new Error('Boo!')
  //   }),
  //   fromPairs,
  // )

  const zodObject = z.object(
    // objectFromEntries(
    //   Object.entries(object).map(
    //     ([key, value]: [Key, { type: XOR<'string', 'number'> }]) => {
    //       if (value.type === 'string') {
    //         return [key, z.string()]
    //       }
    //       if (value.type === 'number') {
    //         return [key, z.number()]
    //       }
    //       throw new Error('Boo!')
    //     },
    //   ),
    // ),
    // mapValues(object, (value) => {
    //   if (value === 'string') {
    //     return z.string().readonly()
    //   }
    //   if (value === 'number') {
    //     return z.number().readonly()
    //   }
    //   throw new Error('Boo!')
    // }),
    mapValues(object, (value) => {
      if (value.type === 'number') {
        return actualInput[]
      }
      if (value.type === 'string') {
        return z.string() as ZodString
      }
      throw new Error()
    }),
    // mapToObj(list, (x) => {
    //   return [x.name, z.number()]
    //   // if (x.type === 'number') {
    //   // }
    //   // return [x.name, z.string()]
    // }),
  )

  type RESULT = z.infer<typeof zodObject>
  return zodObject as unknown as RESULT
}

// function inferTypeFromZodObject<T extends ZodRawShape>(
//   zodObject: ZodObject<T>,
// ) {
//   type BAZ = z.infer<typeof zodObject>
//   return zodObject as unknown as BAZ
// }

const object = {
  aNumber: { type: 'number' },
  aString: { type: 'string' },
}

const list = [
  { name: 'aNumber', type: 'number' },
  { name: 'aString', type: 'string' },
] as const

const result = getTypedObject(object)

// const result = inferTypeFromZodObject(baz)

result.aNumber

function withoutZod<const Key extends string, Object extends Record<Key, { type: 'string' | 'number'}>>(object:Object){
  const returnType = mapValues(object, (value) => {
    if (value.type === 'string'){
      return 'hello' as string
    } 
    if (value.type === 'number'){
      return 42 as number
    } 
    return 'hello' as string
  })
  return returnType
}

function listWithoutZod<Key extends string, Item extends { name: Key, type: XOR<'string', 'number'>}>(list:Readonly<Array<Item>>){
  const returnType = mapToObj(list, (value): [Key, string | number] => {
    if (value.type === 'string'){
      return [value.name, 'hello' as string]
    } 
    if (value.type === 'number'){
      return [value.name, 42 as number]
    }
    return [value.name, 'hello' as string]
  })
  return returnType
}

const result2 = withoutZod(object)
const r = result2['aNumber']
const listResult = listWithoutZod(list)
listResult.aNumber

function identity<Key extends string, Object extends Record<Key, 'string' | 'number'>,ReturnObject extends Record< Key, XOR<string, number> >>(record: Object): ReturnObject{
  // const returnValue: ReturnObject = {}
  // for (const key in record) {
  //   if (record[key] === 'string'){
  //     returnValue[key] = 'hello' 
  //   }
  // }
  // return returnValue
  const returnType: ReturnObject = mapValues(record, (value) => {
    if (value === 'string'){
      return 'hello' as string
    } 
    if (value === 'number'){
      return 42 as number
    } 
    return 'hello' as string
  })
  return returnType
}

const simpleResult = identity({
  a: 'string',
  b: 'number'
})
simpleResult.b

// function test<T extends string | number>(
//   a: Record<string, T>,
// ): Record<string, T> {
//   return a
// }

// const b = test({ a: 'string', b: 1 })

// b['a']

// From stack overflow

class Type<T> {
  // just a marker
  declare readonly _type: T
}

type AnyType = Type<any>

class Optional<T extends AnyType> {
  constructor(readonly inner: T) {}
}

type Shape = { [k: string]: string | number }

type TypeOfShape<T extends Shape> =
  {
    [K in keyof T as T[K] extends AnyType ? K : never]: T[K] extends AnyType ?
      T[K]['_type']
    : never
  } & {
    [K in keyof T as T[K] extends Optional<AnyType> ? K
    : never]?: T[K] extends Optional<AnyType> ? T[K]['inner']['_type'] : never
  } extends infer U ?
    { [K in keyof U]: U[K] }
  : never
