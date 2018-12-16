import React from "react";
import { Query } from "react-apollo";
import { Spinner, Table, Dialog, Avatar } from "evergreen-ui";
import { GET_REPO_INFOS } from "./query";

// export default ({ variables, key }) => {
export default class Repository extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.variables.name,
      nb: props.variables.nb,
      idx: props.variables.idx,
      isShown: false
    };
  }

  render() {
    const { name, nb, idx, isShown } = this.state;
    return (
      <Query query={GET_REPO_INFOS} variables={{ name, nb }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <Spinner />;
          }

          if (data) {
            let dialog = (
              <Dialog
                isShown={isShown}
                title="Danger intent"
                hasFooter={false}
                onCloseComplete={() => this.setState({ isShown: false })}
              >
                Dialog content
              </Dialog>
            );

            const { repository } = data.viewer;
            let totalCount;
            if (repository) {
              const { name, description, resourcePath, isPrivate } = repository;
              const collabs = repository.collaborators.nodes;
              const languages = repository.languages.nodes;
              if (repository.defaultBranchRef) {
                totalCount =
                  repository.defaultBranchRef.target.history.totalCount;
              }

              return (
                <>
                  {dialog}
                  <Table.Row
                    key={idx}
                    isSelectable
                    onSelect={() => {
                      this.setState({ isShown: true });
                    }}
                  >
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
                        return (
                          <>
                            {el.name} <br />
                          </>
                        );
                      })}
                    </Table.TextCell>
                    <Table.TextCell>
                      {collabs.map(el => {
                        return (
                          <>
                            {" "}
                            <Avatar
                              size={20}
                              shape="circle"
                              src={el.avatarUrl}
                            />
                            {el.login} <br />
                          </>
                        );
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
  }
}
