import React from "react";
import { Query } from "react-apollo";
import { Spinner, Table } from "evergreen-ui";
import { GET_REPO_INFOS } from "./query";

export default ({ variables, key }) => {
  const { name, nb, idx } = variables;

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
            const languages = repository.languages.nodes;
            if (repository.defaultBranchRef) {
              totalCount =
                repository.defaultBranchRef.target.history.totalCount;
            }

            return (
              <>
                <Table.Row key={idx}>
                  <Table.TextCell>
                    <span role="img" aria-label="Ghost">
                      👻
                    </span>
                    {name}
                  </Table.TextCell>
                  <Table.TextCell>
                    <span role="img" aria-label="Invader">
                      👾{" "}
                    </span>
                    {description ? description : "N/A"}
                  </Table.TextCell>
                  <Table.TextCell>
                    <span role="img" aria-label="Black Moon">
                      🌑{" "}
                    </span>
                    {resourcePath}
                  </Table.TextCell>
                  <Table.TextCell>
                    Commits: {totalCount ? totalCount : 0}
                  </Table.TextCell>
                  <Table.TextCell>
                    {!isPrivate ? (
                      <>
                        <span role="img" aria-label="Check">
                          ✔️
                        </span>{" "}
                        Public
                      </>
                    ) : (
                      <>
                        <span role="img" aria-label="Denied">
                          🚫
                        </span>
                        Private
                      </>
                    )}
                  </Table.TextCell>
                  <Table.TextCell>
                    {languages.map(el => {
                      return <>{el.name} </>;
                    })}
                  </Table.TextCell>
                </Table.Row>
              </>
            );
          }
        }
        return null;
      }}
    </Query>
  );
};
