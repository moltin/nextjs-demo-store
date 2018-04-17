import Router from 'next/router'
import {
  Header,
  Form,
  Input,
  Button,
  Segment,
  Message
} from 'semantic-ui-react'

import Layout from '../components/Layout'

import { login } from '../lib/moltin'

export default class Login extends React.Component {
  state = {
    email: '',
    password: '',
    loading: false,
    errors: null
  }

  _handleSubmit = async e => {
    e.preventDefault()

    const { email, password } = this.state

    this.setState({
      loading: true,
      errors: null
    })

    try {
      const { id, token } = await login({ email, password })
      localStorage.setItem('customerToken', token)
      localStorage.setItem('mcustomer', id)
      Router.push('/myaccount')
    } catch (e) {
      console.log(e.message)
      this.setState({
        loading: false,
        errors: e
      })
    }
  }

  _handleChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value })

  render() {
    const { loading, errors } = this.state

    return (
      <Layout title="Login">
        <Header as="h1">Log in to your account</Header>

        <Form onSubmit={this._handleSubmit} loading={loading} error={!!errors}>
          <Message
            error
            header="Sorry"
            content="Please check your login details and try again."
          />

          <Segment>
            <Form.Field>
              <label>Email</label>
              <Input
                fluid
                name="email"
                type="email"
                onChange={e => this._handleChange(e)}
              />
            </Form.Field>

            <Form.Field>
              <label>Password</label>
              <Input
                fluid
                name="password"
                type="password"
                onChange={e => this._handleChange(e)}
              />
            </Form.Field>

            <Button type="submit" color="orange">
              Login
            </Button>
          </Segment>
        </Form>
      </Layout>
    )
  }
}
