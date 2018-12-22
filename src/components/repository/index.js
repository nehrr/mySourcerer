import React from "react";
import { Query } from "react-apollo";
import {
  Spinner,
  Table,
  Dialog,
  Avatar,
  Button,
  Pane,
  Heading,
  Badge
} from "evergreen-ui";
import { Timeline, Icon } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import { GET_REPO_INFOS } from "./query";

export default class Repository extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nb: props.variables.nb,
      first: props.variables.first,
      isShown: false,
      login: props.variables.login,
      query: GET_REPO_INFOS,
      repoData: null
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
            this.setState({ isShown: true, repoData: el });
          }}
        >
          <Table.TextCell>
            <span role="img" aria-label="Ghost">
              👻
            </span>
            {el.name} <br />
            {el.description ? el.description : null}
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

  dialog = data => {
    const { isShown } = this.state;
    if (data) {
      let totalCount;

      const collabs = data.collaborators ? data.collaborators.nodes : null;
      const languages = data.languages.nodes;
      let { name, description, isPrivate } = data;
      const commits = data.defaultBranchRef
        ? data.defaultBranchRef.target.history.nodes
        : null;
      if (data.defaultBranchRef) {
        totalCount = data.defaultBranchRef.target.history.totalCount;
      }
      name = `Repository: ${name}`;
      return (
        <Dialog
          isShown={isShown}
          title={name}
          hasFooter={false}
          width={800}
          onCloseComplete={() => this.setState({ isShown: false })}
        >
          <Pane
            flexDirection="column"
            marginBottom={24}
            justifyContent="center"
            alignItems="center"
          >
            <Pane
              width="60%"
              float="left"
              justifyContent="center"
              alignItems="center"
              flexDirection="row"
            >
              <Pane
                justifyContent="center"
                alignItems="center"
                float="left"
                flexDirection="row"
              >
                {description ? (
                  <>
                    <Heading size={800}>What?</Heading>
                    <Pane marginBottom={20}> {description} </Pane>
                  </>
                ) : null}

                {collabs ? (
                  <Pane marginBottom={20}>
                    <Heading size={800}>Who?</Heading>
                    {collabs.map(el => {
                      return (
                        <Pane
                          is="section"
                          justifyContent="center"
                          alignItems="center"
                          float="left"
                          margin={5}
                          padding={5}
                          flexDirection="row"
                          cursor="help"
                          onClick={() => {
                            window.open(el.url, "_blank");
                          }}
                        >
                          <Avatar
                            size={100}
                            shape="circle"
                            src={el.avatarUrl}
                          />
                          <br />
                          {el.login}
                        </Pane>
                      );
                    })}{" "}
                  </Pane>
                ) : null}
                <br />

                <Pane marginBottom={20}>
                  <Heading size={800}>Where?</Heading>
                  {!isPrivate ? (
                    <>
                      <span role="img" aria-label="Check">
                        ✔️
                      </span>
                      Public
                      <br />
                      <Button
                        height={40}
                        marginRight={12}
                        iconBefore="manual"
                        appearance="primary"
                        intent="none"
                        onClick={() => {
                          window.open(data.url, "_blank");
                        }}
                      >
                        Check on GitHub
                      </Button>
                    </>
                  ) : (
                    <>
                      <span role="img" aria-label="Denied">
                        🚫
                      </span>
                      Private
                      <br />
                      <Button
                        height={40}
                        marginRight={12}
                        iconBefore="manual"
                        appearance="primary"
                        intent="none"
                        disabled
                      >
                        Check on GitHub
                      </Button>
                    </>
                  )}
                </Pane>
                <Pane marginBottom={20}>
                  <Heading size={800}>Which?</Heading>
                  {languages &&
                    languages.map(el => {
                      return (
                        <>
                          <Badge color="green" marginRight={8}>
                            {el.name}
                          </Badge>
                        </>
                      );
                    })}
                </Pane>
              </Pane>
            </Pane>
            <Pane
              width="40%"
              float="right"
              justifyContent="center"
              alignItems="center"
            >
              <Heading size={800}>When & What?</Heading>
              <Pane marginBottom={10} marginTop={10}>
                <Icon type="sync" />
                Total commits: {totalCount ? totalCount : "N/A"}
              </Pane>
              {commits && (
                <Timeline>
                  {commits.map(el => {
                    return (
                      <Timeline.Item color="blue">
                        {moment(el.authoredDate.toString()).format("LLL")}
                        <br /> {el.message ? el.message : "N/A"} <br />
                        <Icon
                          type="plus-circle"
                          theme="twoTone"
                          twoToneColor="#52c41a"
                        />
                        {el.additions}
                        <br />
                        <Icon
                          type="minus-circle"
                          theme="twoTone"
                          twoToneColor="red"
                        />
                        {el.deletions}
                      </Timeline.Item>
                    );
                  })}
                </Timeline>
              )}
            </Pane>
          </Pane>
        </Dialog>
      );
    }
  };

  render() {
    const { first, nb, login, query, repoData } = this.state;
    return (
      <Query query={query} variables={{ first, nb, login }} errorPolicy="all">
        {({ loading, error, data, fetchMore }) => {
          if (loading) {
            return <Spinner />;
          }

          if (!data) {
            if (error) {
              return (
                <Pane
                  background="tint1"
                  border="muted"
                  width={800}
                  marginBottom={24}
                >
                  Could not retrieve repositories data
                </Pane>
              );
            }
          }

          if (data) {
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
                  {this.dialog(repoData)}

                  <Table>
                    <Table.Head>
                      <Table.TextHeaderCell>Repository</Table.TextHeaderCell>
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
