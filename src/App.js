import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import gql from "graphql-tag";
import { SearchInput, Button, Pane, toaster } from "evergreen-ui";
import Description from "./components/description/";
import Languages from "./components/languages/";
import Overview from "./components/overview/";
import Repository from "./components/repository/";

import "./App.css";

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  opts: {
    mode: "no-cors"
  },
  request: operation => {
    const { REACT_APP_TOKEN } = process.env;
    operation.setContext(context => ({
      headers: {
        ...context.headers,
        authorization: `Bearer ${REACT_APP_TOKEN}`
      }
    }));
  }
});

class App extends Component {
  state = {
    name: "nehrr",
    search: ""
  };

  componentDidMount() {
    if (localStorage.getItem('name')) {
      const name = localStorage.getItem('name');
      this.setState({name})
    }
  }

  _handleEnter = () => {
    const { search } = this.state;
    const CHECK_LOGIN = gql`
      query($login: String!) {
        user(login: $login) {
          login
        }
      }
    `;

    client
      .query({ query: CHECK_LOGIN, variables: { login: search } })
      .then(res => {
        if (res.data.user !== null) {
          const {login} = res.data.user
          this.setState({ name: login });
          localStorage.setItem('name', login);
        }
      })
      .catch(error => {
        toaster.danger("This user does not exist");
      });
  };

  render() {
    const { name } = this.state;
    let login = name;
    return (
      <div className="App">
        <header className="App-header">
          <ApolloProvider client={client}>
            <Pane flexDirection="row" margin={24}>
              <SearchInput
                placeholder="Search user..."
                onChange={e => this.setState({ search: e.target.value })}
              />
              <Button onClick={this._handleEnter}>Search</Button>
            </Pane>
            <Description variables={{ nb: 100, login }} />
            <Repository variables={{ first: 10, nb: 10, login }} />
            <Languages variables={{ nb: 100, login }} />
            <Overview variables={{ nb: 100, login }} />
          </ApolloProvider>
        </header>
      </div>
    );
  }
}

export default App;
