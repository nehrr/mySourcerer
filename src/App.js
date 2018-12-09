import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Description from "./components/description/";
import Languages from "./components/languages/";
import Overview from "./components/overview/";

import logo from "./ch0pper.png";
import "./App.css";

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
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
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Description variables={{ nb: 100 }} />
            <Languages variables={{ nb: 100 }} />
            <Overview variables={{ nb: 100 }} />
          </header>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
