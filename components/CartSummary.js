import StripeCheckout from 'react-stripe-checkout'
import { Button, Segment, Divider } from 'semantic-ui-react'

export default ({
  handleCheckout,
  display_price: {
    with_tax: { amount, currency, formatted }
  }
}) => (
  <React.Fragment>
    <Divider />
    <Segment clearing size="large">
      <strong>Sub total:</strong> {formatted}
      <StripeCheckout
        name="NextJS Demo Store"
        amount={amount}
        currency={currency}
        stripeKey={process.env.STRIPE_PUBLISHABLE_KEY}
        shippingAddress={false}
        billingAddress={true}
        zipCode={true}
        token={handleCheckout}
        reconfigureOnUpdate={false}
        triggerEvent="onClick"
      >
        <Button color="black" floated="right">
          Check out
        </Button>
      </StripeCheckout>
    </Segment>
  </React.Fragment>
)
