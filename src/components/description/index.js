import React from "react";
import { Query } from "react-apollo";
import { Spinner } from "evergreen-ui";
import { GET_DATA, GET_REPO } from "./query";

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

            const nbFollowers = Object.keys(followers).length;
            const nbFollowing = Object.keys(following).length;

            return (
              <>
                <img src={avatarUrl} alt="avatar" />
                <h1>
                  {login} {name} {bio} {location}
                </h1>
                <div>
                  Followers: {nbFollowers} || Following: {nbFollowing}
                  <br />
                  Repos: {nbRepos}
                </div>
              </>
            );
          }
          return <></>;
        }}
      </Query>

      <Query query={GET_REPO} variables={{ nb }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <Spinner />;
          }
          if (data) {
            let nbCommit = 0;
            const repositories = data.viewer.repositories.nodes;

            repositories.map(el => {
              if (el.defaultBranchRef) {
                const commits = el.defaultBranchRef.target.history.totalCount;
                nbCommit += commits;
              }
              return nbCommit;
            });
            return (
              <>
                <div>Commits: {nbCommit}</div>
              </>
            );
          }
          return <></>;
        }}
      </Query>
    </>
  );
};
