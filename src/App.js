import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { SearchInput, Button, Pane } from "evergreen-ui";
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
  constructor(props) {
    super(props);
    this.state = {
      name: "nehrr",
      search: ""
    };
  }

  _handleEnter = () => {
    const { search } = this.state;
    this.setState({ name: search });
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
