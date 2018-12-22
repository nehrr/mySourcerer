import React from "react";
import { Query } from "react-apollo";
import { Spinner, Avatar, Pane, Heading, toaster } from "evergreen-ui";
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

          if (error) {
            toaster.notify("There was an issue retrieving data");
            return (
              <Pane
                background="tint1"
                border="muted"
                width={800}
                marginBottom={24}
              >
                Could not retrieve description data
              </Pane>
            );
          }

          if (data) {
            const { login, name, bio, location, avatarUrl, url } = data.user;
            const followers = data.user.followers.nodes;
            const following = data.user.following.nodes;
            const nbRepos = data.user.repositories.totalCount;

            const nbFollowers = Object.keys(followers).length;
            const nbFollowing = Object.keys(following).length;

            let nbCommit = 0;
            const repositories = data.user.repositories.nodes;
            let latestCommit = "";
            if (data.user.repositories.nodes[0]) {
              latestCommit = moment(
                data.user.repositories.nodes[0].defaultBranchRef.target.history.nodes[0].authoredDate.toString()
              ).format("LLL");
            }

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
                    <Pane
                      cursor="help"
                      onClick={() => {
                        window.open(url, "_blank");
                      }}
                    >
                    <Avatar
                      size={100}
                      shape="circle"
                      src={avatarUrl}
                      style={{ marginRight: 100 }}
                    />
                  </Pane>
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
