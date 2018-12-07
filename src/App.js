import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";

import logo from "./ch0pper.png";
import "./App.css";
const token = "a0b5bf78faa9aa31e666a23a99ab1ed838605894";

const client = new ApolloClient({
  uri: "https://api.github.com/graphql"
});

// client.query({
//   query: gql`
//     query {
//       hello
//     }
//   `
// }).then(result => console.log(result))

const PingServer = () => (
  <Query
    query={gql`
      query {
        viewer {
          login
        }
      }
    `}
    context={{
      headers: {
        authorization: "Bearer " + token
      }
    }}
  >
    {({ loading, error, data }) => {
      console.log(data);
      if (loading) {
        return <span>WAIT</span>;
      }
      return <h1>Data</h1>;
    }}
  </Query>
);

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <PingServer />
          </header>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
