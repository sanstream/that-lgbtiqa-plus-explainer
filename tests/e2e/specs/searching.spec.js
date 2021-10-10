/// <reference types="Cypress" />

const basePath = 'http://localhost:8080/'
const cssSelectorGraphs = '[data-test-e2e="SpectrumPositionGraphs"]'

function CheckValues (values) {
  values.forEach((spectrum, spectrumIndex) => {
    spectrum.forEach((spectrumItemValue, spectrumItemIndex) => {
      cy.get(cssSelectorGraphs + ` > ol > li:nth-of-type(${spectrumIndex + 1}) > ol > li:nth-of-type(${spectrumItemIndex + 1})`)
        .should('have.attr', 'data-is-active', spectrumItemValue.toString())
    })
  })
}

context('When loading the app', () => {
  it('shows me the visualisation when searching for nothing', () => {
    cy.visit(basePath)
    CheckValues([
      [ false, false, false, false, false ], // Gender identity
      [ false, false, false, false, false ], // bio sex
      [ false, false, false, false, false ], // gender transition
      [ false, false, false, false, false ], // sexually attracted to
      [ false, false, false, false, false ], // romantically attracted to
    ])
  })

  it('shows me the visualisation when searching for lesbian', () => {
    // based on the lack specific terms the app assumes certain things,since they will apply to the
    // majority of people.
    cy.visit(basePath + '?identity=lesbian')
    CheckValues([
      [ false, false, false, true, true ], // Gender identity
      [ false, false, false, true, true ], // bio sex
      [ false, false, false, false, true ], // gender transition
      [ false, false, true, true, true ], // sexually attracted to
      [ false, false, true, true, true ], // romantically attracted to
    ])
  })

  it('shows me the visualisation when searching for asexual transgender lesbian', () => {
    cy.visit(basePath + '?identity=asexual&identity=transgender&identity=lesbian')
    CheckValues([
      [ false, false, true, true, true ], // Gender identity
      [ false, false, false, true, true ], // bio sex 'transgender' overrules the default values of 'lesbian' and sets them  to 'man'
      [ true, true, true, true, false ], // gender transition, 'transgender' overrules the default values of 'lesbian' and sets them  to 'trans'
      [ false, false, false, false, false ], // sexually attracted to, 'asexual' overrules the default values of 'lesbian'
      [ false, false, true, true, true ], // romantically attracted to
    ])
  })
})
