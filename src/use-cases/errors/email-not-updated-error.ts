// src/errors/user-not-found-error.ts
export class EmailNotUpdatedError extends Error {
  constructor() {
    super('Email update is not allowed')
    this.name = 'EmailNotUpdatedError'
  }
}
