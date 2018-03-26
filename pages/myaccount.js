import Router from 'next/router'

import Layout from '../components/Layout'
import OrderItemList from '../components/OrderItemList'

import { getOrders } from '../lib/moltin'

export default class MyAccount extends React.Component {
  state = {
    loading: true,
    orders: []
  }

  async componentDidMount() {
    const token = localStorage.getItem('customerToken')

    if (!token) {
      Router.push('/login')
    }

    const { json: { data, included, meta } } = await getOrders(token)

    const orders = data.map(order => {
      // const orderItems = order.relationships.items.data
      // const includedItems = included.items.map(i => i.id === )

      return {
        ...order
      }
    })
    console.log(orders)

    this.setState({
      loading: false,
      orders,
      included,
      meta
    })

    console.log(data)
    console.log(included)
  }

  render() {
    return (
      <Layout title="My account">
        <OrderItemList {...this.state} />
      </Layout>
    )
  }
}
