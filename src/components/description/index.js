import React from "react";
import { Query } from "react-apollo";
import { Spinner, Avatar, Pane, Table } from "evergreen-ui";
import Repository from "../repository";
import moment from "moment";
import { GET_DATA, GET_REPO } from "./query";

let repos = [];

export default ({ variables }) => {
  const { nb } = variables;

  return (
    <>
      <Query query={GET_DATA} variables={{ nb }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <Spinner />;
          }
          if (data) {
            const { login, name, bio, location, avatarUrl } = data.viewer;
            const followers = data.viewer.followers.nodes;
            const following = data.viewer.following.nodes;
            const nbRepos = data.viewer.repositories.totalCount;
            const repositories = data.viewer.repositories.nodes;

            const nbFollowers = Object.keys(followers).length;
            const nbFollowing = Object.keys(following).length;
            return (
              <Query query={GET_REPO} variables={{ nb }}>
                {({ loading, error, data }) => {
                  if (loading) {
                    return <Spinner />;
                  }
                  if (data) {
                    let nbCommit = 0;
                    const repositories = data.viewer.repositories.nodes;
                    let latestCommit = moment(
                      data.viewer.repositories.nodes[0].defaultBranchRef.target.history.nodes[0].authoredDate.toString()
                    ).format("LLL");

                    repositories.map((el, idx) => {
                      const { name } = el;
                      if (!repos.includes(name) && repos.length <= 10) {
                        repos.push(
                          <Pane background="tint1" border="muted">
                            <Repository variables={{ name, nb, idx }} />
                          </Pane>
                        );
                      }
                      if (el.defaultBranchRef) {
                        const commits =
                          el.defaultBranchRef.target.history.totalCount;
                        nbCommit += commits;
                      }
                      return nbCommit;
                    });

                    return (
                      <>
                        <Pane justifyContent="center" alignItems="center">
                          <Pane
                            display="flex"
                            flexDirection="row"
                            float="left"
                            marginBottom={24}
                            background="tint1"
                            border="muted"
                            width={800}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Avatar
                              size={100}
                              shape="circle"
                              src={avatarUrl}
                              style={{ marginRight: 100 }}
                            />
                            {name} aka {login} <br />
                            {bio} @ {location}
                            <br />
                            Followers: {nbFollowers} || Following: {nbFollowing}
                            <br />
                            Repositories: {nbRepos} <br />
                            Commits: {nbCommit} || Latest commit: {latestCommit}
                          </Pane>
                        </Pane>
                        <Pane
                          background="tint1"
                          border="muted"
                          width={800}
                          marginBottom={24}
                        >
                          <Table>
                            <Table.Head>
                              <Table.TextHeaderCell>
                                Repository
                              </Table.TextHeaderCell>
                              <Table.TextHeaderCell>
                                Description
                              </Table.TextHeaderCell>
                              <Table.TextHeaderCell>Path</Table.TextHeaderCell>
                              <Table.TextHeaderCell>
                                Commits
                              </Table.TextHeaderCell>
                              <Table.TextHeaderCell>
                                Privacy
                              </Table.TextHeaderCell>
                              <Table.TextHeaderCell>
                                Languages
                              </Table.TextHeaderCell>
                            </Table.Head>
                            <Table.Body>{repos}</Table.Body>
                          </Table>
                        </Pane>
                      </>
                    );
                  }
                  return null;
                }}
              </Query>
            );
          }
          return <></>;
        }}
      </Query>
    </>
  );
};
