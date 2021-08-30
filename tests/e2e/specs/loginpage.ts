import { NightwatchBrowser, NightwatchTests } from "nightwatch";

const loginpage: NightwatchTests = {
  "verifying the loginpage": (client: NightwatchBrowser) => {
    client
      .init()
      .url("http://localhost:8080")
      .windowMaximize("max")
      .pause(10000);
    client.expect.element("#app").to.be.present.before(3000);
    client.expect.element(".classification-banner").to.be.present.before(1000);
    client.expect
      .element(".USWDC-official-banner__text")
      .text.to.equal("An official website of the United States government");
    client.expect
      .element("span.USWDC-official-banner__link_msg")
      .text.to.equal("Here’s how you know");
    client.expect
      .element(".container")
      .text.to.contain("Access the ATAT Cloud");
    client.expect.element("#login_button").to.be.present.before(2000);
    client.click("#login_button");

    client.expect
      .element("#atat-header-nav__logout")
      .to.be.present.before(1000);
    client.getText(
      "h1.mb-5.h1.font-weight-bold",
      function (result: { status: any; value: any }) {
        if (typeof result == "object" && result.status == 0) {
          client.assert.equal(result.value, "ATAT Cloud Services");
        }
      }
    );
    client.getText(
      "h3.h3.mb-7:nth-child(1)",
      function (result: { status: any; value: any }) {
        console.log(result.value);
      }
    );
    client.end();
  },
};
export default loginpage;
