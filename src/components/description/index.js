import React from "react";
import { Query } from "react-apollo";
import { Spinner, Avatar, Pane, Heading } from "evergreen-ui";
import moment from "moment";
import { GET_DATA } from "./query";

export default ({ variables }) => {
  return (
    <>
      <Query query={GET_DATA} variables={variables}>
        {({ loading, error, data }) => {
          if (loading) {
            return <Spinner />;
          }
          if (data) {
            const { login, name, bio, location, avatarUrl } = data.viewer;
            const followers = data.viewer.followers.nodes;
            const following = data.viewer.following.nodes;
            const nbRepos = data.viewer.repositories.totalCount;

            const nbFollowers = Object.keys(followers).length;
            const nbFollowing = Object.keys(following).length;

            let nbCommit = 0;
            const repositories = data.viewer.repositories.nodes;
            let latestCommit = moment(
              data.viewer.repositories.nodes[0].defaultBranchRef.target.history.nodes[0].authoredDate.toString()
            ).format("LLL");

            repositories.map((el, idx) => {
              if (el.defaultBranchRef) {
                const commits = el.defaultBranchRef.target.history.totalCount;
                nbCommit += commits;
              }
              return nbCommit;
            });

            return (
              <>
                <Heading size={900}>Who?</Heading>
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
                    style={{ fontSize: "12px" }}
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
              </>
            );
          }
        }}
      </Query>
    </>
  );
};
