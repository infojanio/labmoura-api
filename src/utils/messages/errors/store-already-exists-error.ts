export class StoreAlreadyExistsError extends Error {
  constructor() {
    super('Name store already exists.')
  }
}
