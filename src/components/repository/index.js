import React from "react";
import { Query } from "react-apollo";
import {
  Spinner,
  Table,
  Dialog,
  Avatar,
  Button,
  Pane,
  Heading
} from "evergreen-ui";
import { GET_REPO_INFOS } from "./query";

export default class Repository extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nb: props.variables.nb,
      first: props.variables.first,
      isShown: false,
      login: props.variables.login,
      query: GET_REPO_INFOS
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ login: nextProps.variables.login });
  }

  row = (el, idx) => {
    let totalCount;

    const collabs = el.collaborators ? el.collaborators.nodes : null;
    const languages = el.languages.nodes;
    if (el.defaultBranchRef) {
      totalCount = el.defaultBranchRef.target.history.totalCount;
    }
    return (
      <>
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
            {el.name}
          </Table.TextCell>
          <Table.TextCell>
            <span role="img" aria-label="Invader">
              👾
            </span>
            {el.description ? el.description : "N/A"}
          </Table.TextCell>
          <Table.TextCell>
            <span role="img" aria-label="Black Moon">
              🌑
            </span>
            {el.resourcePath}
          </Table.TextCell>
          <Table.TextCell>
            Commits: {totalCount ? totalCount : 0}
          </Table.TextCell>
          <Table.TextCell>
            {!el.isPrivate ? (
              <>
                <span role="img" aria-label="Check">
                  ✔️
                </span>
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
            {collabs
              ? collabs.map(el => {
                  return (
                    <>
                      <Avatar size={20} shape="circle" src={el.avatarUrl} />
                      {el.login} <br />
                    </>
                  );
                })
              : "N/A"}
          </Table.TextCell>
        </Table.Row>
      </>
    );
  };

  render() {
    const { first, isShown, nb, login, query } = this.state;
    return (
      <Query query={query} variables={{ first, nb, login }} errorPolicy="all">
        {({ loading, error, data, fetchMore }) => {
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

            let repositories = data.user.repositories.nodes;
            const { pageInfo } = data.user.repositories;

            return (
              <>
                <Heading size={900}>What?</Heading>
                <Pane
                  background="tint1"
                  border="muted"
                  width={800}
                  marginBottom={24}
                >
                  {dialog}

                  <Table>
                    <Table.Head>
                      <Table.TextHeaderCell>Repository</Table.TextHeaderCell>
                      <Table.TextHeaderCell>Description</Table.TextHeaderCell>
                      <Table.TextHeaderCell>Path</Table.TextHeaderCell>
                      <Table.TextHeaderCell>Commits</Table.TextHeaderCell>
                      <Table.TextHeaderCell>Privacy</Table.TextHeaderCell>
                      <Table.TextHeaderCell>Languages</Table.TextHeaderCell>
                      <Table.TextHeaderCell>Collaborators</Table.TextHeaderCell>
                    </Table.Head>
                    <Table.Body>
                      {repositories.map((repo, idx) => {
                        return this.row(repo, idx);
                      })}
                    </Table.Body>
                  </Table>
                  <Button
                    marginRight={16}
                    appearance="minimal"
                    onClick={() => {
                      if (pageInfo.hasPreviousPage) {
                        fetchMore({
                          variables: {
                            cursorDown: pageInfo.startCursor,
                            first: null,
                            last: 10
                          },
                          updateQuery: (prev, { fetchMoreResult }) => {
                            return Object.assign({}, prev, fetchMoreResult);
                          }
                        });
                      }
                    }}
                  >
                    Previous
                  </Button>
                  <Button
                    marginRight={16}
                    appearance="minimal"
                    onClick={() => {
                      if (pageInfo.hasNextPage) {
                        fetchMore({
                          variables: {
                            cursorUp: pageInfo.endCursor,
                            last: null,
                            first: 10
                          },
                          updateQuery: (prev, { fetchMoreResult }) => {
                            return Object.assign({}, prev, fetchMoreResult);
                          }
                        });
                      }
                    }}
                  >
                    Next
                  </Button>
                </Pane>
              </>
            );
          }
          return null;
        }}
      </Query>
    );
  }
}
