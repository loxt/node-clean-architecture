class Person {
  speak (name?: string) : string {
    return `Olá ${name?.toUpperCase() ?? 'mundo'}!`
  }
}

const person = new Person()
person.speak('TypeScript') // Olá TYPESCRIPT!
person.speak() // Olá mundo!