export class MaxNumberOfOrdersError extends Error {
  constructor() {
    super('Max number of orders reached.')
  }
}
