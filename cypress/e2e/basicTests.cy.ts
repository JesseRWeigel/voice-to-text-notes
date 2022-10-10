import cypress from "cypress";

describe("some basic sanity tests", () => {
	before(() => {
		cy.log("**Navigate to the application url**");
		cy.visit("/");
	});

	it("should have all the information texts and links as expected", () => {
		cy.log("**Verifying that the descriptive text is as expected**");
		cy.get(".container").within(($textField) => {
			expect(
				$textField
					.text()
					.includes(
						"This app uses the Deepgram API to turn speech into text! Sign up and generate an api key"
					)
			).to.be.true;

			expect(
				$textField
					.text()
					.includes(
						"Your key stays in the browser and is only used to call the DeepgramAPI. Saving a key only stores it in you browser's localStorage."
					)
			).to.be.true;

			cy.log("**Verifying the Deepgram sign up link**");
			cy.get("a.App-link").should(
				"have.attr",
				"href",
				"https://console.deepgram.com/signup"
			);
		});
	});

	it("should have API key field as a password field", () => {
		cy.get(".apiInput").should("have.attr", "type", "password");

		cy.log("**User should be able to type in the API key input field**");
		cy.get(".apiInput")
			.type("someRandomAPIKey")
			.then(() => {
				cy.get(".apiInput").should("have.value", "someRandomAPIKey");
			});
	});

	it("should display all of the buttons correctly", () => {
		const buttonTexts = [
			"Save Key Locally",
			"Get Locally Saved Key",
			"Transcribe",
		];

		cy.get("button").each(($button, index) => {
			expect($button.text()).to.equal(buttonTexts[index]);
		});
	});
});
