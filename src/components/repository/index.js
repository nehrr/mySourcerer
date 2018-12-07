import React from "react";
import { Query } from "react-apollo";
import { Spinner } from "evergreen-ui";
import { GET_REPO_INFOS } from "./query";

export default ({ variables }) => {
  const { name, nb } = variables;
  return (
    <Query query={GET_REPO_INFOS} variables={{ name, nb }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Spinner />;
        }

        if (data) {
          const { repository } = data.viewer;
          let totalCount;
          if (repository) {
            const { name, description, resourcePath, isPrivate } = repository;
            if (repository.defaultBranchRef) {
              // console.log(repository.defaultBranchRef.target.history);

              totalCount =
                repository.defaultBranchRef.target.history.totalCount;
            }
            return (
              <h4>
                <span>👻</span>
                {name}
                <br />
                <span>👾 </span>
                {description}
                <br />
                <span>🌑 </span>
                {resourcePath}
                <br />
                Commits: {totalCount ? totalCount : 0}
                <br />
                {!isPrivate ? (
                  <>
                    <span>✔️</span> Public
                  </>
                ) : (
                  <>
                    <span>🚫</span>Private
                  </>
                )}
              </h4>
            );
          }
        }
        return null;
      }}
    </Query>
  );
};
