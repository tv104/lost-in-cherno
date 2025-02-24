export function assertNotNull<T>(value: T | null, name: string): asserts value is T {
    if (value === null) {
      throw new Error(`Unexpected '${name}' is null.`)
    }
  }
  