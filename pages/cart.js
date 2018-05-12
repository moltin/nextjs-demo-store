import Layout from '../components/Layout'
import CartItemList from '../components/CartItemList'
import CartSummary from '../components/CartSummary'

import {
  getCartItems,
  removeFromCart,
  checkoutCart,
  payForOrder
} from '../lib/moltin'

export default class Cart extends React.Component {
  state = {
    items: [],
    loading: true,
    completed: false
  }

  async componentDidMount() {
    const cartId = await localStorage.getItem('mcart')
    const {
      json: { data, meta }
    } = await getCartItems(cartId)

    this.setState({
      items: data,
      meta,
      cartId,
      loading: false
    })
  }

  _handleCheckout = async data => {
    const cartId = await localStorage.getItem('mcart')
    const customerId = localStorage.getItem('mcustomer')

    const {
      id: token,
      email,
      card: {
        name,
        address_line1: line_1,
        address_city: city,
        address_country: country,
        address_state: county,
        address_zip: postcode
      }
    } = data

    const customer = customerId ? customerId : { name, email }

    const address = {
      first_name: name.split(' ')[0],
      last_name: name.split(' ')[1],
      line_1,
      city,
      county,
      country,
      postcode
    }

    try {
      const {
        json: {
          data: { id }
        }
      } = await checkoutCart(cartId, customer, address)
      await payForOrder(id, token, email)

      this.setState({
        completed: true
      })
    } catch (e) {
      console.log(e)
    }
  }

  _handleRemoveFromCart = async itemId => {
    const { items, cartId } = this.state
    const {
      json: { data, meta }
    } = await removeFromCart(itemId, cartId)

    this.setState({
      items: data,
      meta
    })
  }

  render() {
    const { meta, ...rest } = this.state
    const { loading } = rest

    return (
      <Layout title="Cart">
        <CartItemList {...rest} removeFromCart={this._handleRemoveFromCart} />
        {!loading &&
          !rest.completed && (
            <CartSummary {...meta} handleCheckout={this._handleCheckout} />
          )}
      </Layout>
    )
  }
}
