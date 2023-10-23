declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(username: string, password: string): Chainable<void>
    // login(): Chainable<Cypress.Response<Response<any>>>
    getInputByLabel(label: string): Chainable<void>
  }
}
