describe('Signed Out Post Bounty Flow ', () => {
  let activeUser = 'carol';

  const bounty: Cypress.Bounty = {
    title: 'Syed Bounty',
    category: 'Web development',
    description: 'This is available',
    amount: '12',
    tribe: 'Amazing Org Tribe',
    deliverables: 'We are good to go man'
  };

  it('Validates sign-in requirements for posting a bounty, including modal display, signing in, and creating a bounty.', () => {
    cy.visit('http://localhost:3007/bounties');
    cy.wait(1000);

    cy.contains('Post a Bounty').click();
    cy.wait(1000);

    cy.contains('I have Sphinx').click();
    cy.wait(1000);

    cy.havesphinxlogin(activeUser);
    cy.wait(1000);

    cy.create_bounty(bounty);
    cy.wait(1000);

    cy.contains(bounty.title).should('exist');
    cy.wait(1000);

    cy.logout(activeUser);
  });
});
