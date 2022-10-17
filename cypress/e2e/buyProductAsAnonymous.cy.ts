import { CHECKOUT_ELEMENTS } from "../elements/checkout/checkout-page";
import { NAVIGATION } from "../elements/navigation";
import { SHARED_ELEMENTS } from "../elements/shared-elements";
import { productsToSearch } from "../fixtures/search";
import { addItemToCart, openProductPage } from "../support/pages/product-page";
import { waitForProgressBarToNotBeVisible } from "../support/shared-operations";
import { payByDummyPayment } from "../support/pages/checkout-page";

describe("Buy product as anonymous user", () => {
  let address;

  before(() => {
    cy.fixture("addresses").then(({ usAddress }) => {
      address = usAddress;
    });
  });

  beforeEach(() => {
    cy.visit("/");
    waitForProgressBarToNotBeVisible();
  });

  it("should be able select product in SRS and create ordev via checkout SRS_1001", () => {
    cy.addAliasToGraphRequest("checkoutEmailUpdate")
      .addAliasToGraphRequest("checkoutShippingAddressUpdate")
      .addAliasToGraphRequest("checkoutBillingAddressUpdate")
      .addAliasToGraphRequest("checkoutDeliveryMethodUpdate")
      .get(SHARED_ELEMENTS.productsList)
      .children()
      .first()
      .click();
    addItemToCart();
    cy.get(NAVIGATION.cartIcon)
      .click()
      .get(CHECKOUT_ELEMENTS.emailInput)
      .type("user@examle.com")
      .wait("@checkoutEmailUpdate")
      .fillUpBasicAddress(address)
      .wait("@checkoutShippingAddressUpdate")
      .wait("@checkoutBillingAddressUpdate")
      .its("response.body.data.checkoutBillingAddressUpdate.checkout.billingAddress")
      .should("not.be.null")
      .get(CHECKOUT_ELEMENTS.deliveryMethods)
      .children()
      .should("be.visible")
      .first()
      .click()
      .wait("@checkoutDeliveryMethodUpdate")
      .its("response.body.data.checkoutDeliveryMethodUpdate.checkout.totalPrice.gross.amount")
      .then((totalPrice) => {
        cy.get(CHECKOUT_ELEMENTS.totalOrderPrice).should("contain", totalPrice);
      });
    payByDummyPayment();
  });

  it("should be able select digital product in SRS and create ordev via checkout SRS_1002", () => {
    const product = productsToSearch.digitalProductLocal; // diffrent DB for demo and base setup when populate local db
    // const product = productsToSearch.digitalProductDemo

    cy.addAliasToGraphRequest("checkoutEmailUpdate").addAliasToGraphRequest(
      "checkoutBillingAddressUpdate"
    );
    openProductPage(product);
    addItemToCart();
    cy.get(NAVIGATION.cartIcon).click();
    cy.get(CHECKOUT_ELEMENTS.deliveryMethods)
      .should("not.exist")
      .get(CHECKOUT_ELEMENTS.emailInput)
      .type("user@examle.com")
      .wait("@checkoutEmailUpdate")
      .fillUpBasicAddress(address)
      .wait("@checkoutBillingAddressUpdate")
      .its("response.body.data.checkoutBillingAddressUpdate.checkout.totalPrice.gross.amount")
      .then((totalPrice) => {
        cy.get(CHECKOUT_ELEMENTS.totalOrderPrice).should("contain", totalPrice);
      });
    payByDummyPayment();
  });
});
