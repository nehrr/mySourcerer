import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Description from "./components/description/";
import Languages from "./components/languages/";
import Overview from "./components/overview/";

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
      <div className="App">
        <header className="App-header">
          <ApolloProvider client={client}>
            <Description variables={{ nb: 100 }} />
            <Languages variables={{ nb: 100 }} />
            <Overview variables={{ nb: 100 }} />
          </ApolloProvider>
        </header>
      </div>
    );
  }
}

export default App;
