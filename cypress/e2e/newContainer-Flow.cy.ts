import Config from '../../src/config.json'

describe('New Container workflow tests', () => {
  beforeEach(() => {
    cy.log('>>>> Start Login')
    cy.login(Cypress.env('AUTH0_TEST_USERNAME'), Cypress.env('AUTH0_TEST_PASSWORD'))
    cy.visit(Cypress.env('CONTAINERS_URL'))
  })

  it('should test if New Container page is shown', () => {
    cy.log('>>>> Test New Container page')
    cy.url().should('equal', Cypress.env('CONTAINERS_URL'))
  })

  it('should test if New Container dialog is shown', () => {
    cy.log('>>>> Test New Container dialog')
    cy.contains('New Container').click()

    cy.get('h6').contains('New Container')

    cy.get('svg[data-testid="ClearIcon"]')
      .invoke('attr', 'data-testid')
      .should('equal', 'ClearIcon')

    cy.contains('label', 'Container(s) ID(s) *').invoke('attr', 'for')
      .then((id) => {
        cy.get(`input#${id}`).should('exist')
      })

    cy.contains('label', 'Inspection Date').invoke('attr', 'for')
      .then((id) => {
        cy.get(`input#${id}`).should('exist')
      })

    cy.contains('label', 'Certification Number').invoke('attr', 'for')
      .then((id) => {
        cy.get(`input#${id}`).should('exist')
      })

    cy.contains('label', 'Certification link').invoke('attr', 'for')
      .then((id) => {
        cy.get(`input#${id}`).should('exist')
      })

    cy.contains('label', 'Certification Date').invoke('attr', 'for')
      .then((id) => {
        cy.get(`input#${id}`).should('exist')
      })

    cy.contains('label', 'Facility ID').invoke('attr', 'for')
      .then((id) => {
        cy.get(`input#${id}`).should('exist')
      })

    cy.contains('label', 'Operational Status')
    cy.get('#outlined-select-container-operational-status').contains('PRODUCTION')

    cy.contains('label', 'Mark as available after actual date').get('[type="checkbox"]').should('exist')

    cy.contains('label', 'Availability Date (planned)').invoke('attr', 'for')
      .then((id) => {
        cy.get(`input#${id}`).should('exist')
      })

    cy.contains('label', 'Availability Date (actual)').invoke('attr', 'for')
      .then((id) => {
        cy.get(`input#${id}`).should('exist')
      })

    cy.contains('Next')
    cy.get('.MuiStepper-horizontal').should('exist')

    cy.contains('Close')
    cy.contains('Create')
  })
})
