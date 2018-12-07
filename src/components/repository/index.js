import React from "react";
import { Query } from "react-apollo";
import { Spinner } from "evergreen-ui";
import { GET_REPO_INFOS } from "./query";

export default ({ variables }) => {
  const { name } = variables;
  return (
    // <h1>Bleh</h1>
    <Query query={GET_REPO_INFOS} variables={{ name }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Spinner />;
        }

        if (data) {
          const { repository } = data.viewer;
          if (repository) {
            const { name } = repository;
            return <h4>{name}</h4>;
          }
        }
        return null;
      }}
    </Query>
  );
};
