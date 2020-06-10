import React, { Component } from 'react'

const UserContext = React.createContext()

class UserProvider extends Component {
  state = {
    apiKey: '',
    name: ''
  }

  // Method to update state
  /*
  setUser = user => {
    this.setState(prevState => ({ user }))
  }*/

  setUser = user => {
    this.setState(user)
  }

  /*
    setValue(field, value) {
      switch (field) {
        case 'apiKey':
            this.user.apiKey = value;
      }
  
      
  
    }*/

  render() {
    const { children } = this.props
    const user = this.state
    const { setUser } = this

    return (
      <UserContext.Provider
        value={{
          user,
          setUser,
        }}
      >
        {children}
      </UserContext.Provider>
    )
  }
}

export default UserContext

export { UserProvider }