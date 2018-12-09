import React from "react";
import { Line } from "react-chartjs-2";
import { Query } from "react-apollo";
import { Spinner } from "evergreen-ui";
import { GET_OVERVIEW } from "./query";

export default ({ variables }) => {
  const { nb } = variables;

  return (
    <>
      <Query query={GET_OVERVIEW} variables={{ nb }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <Spinner />;
          }
          if (data) {
            // console.log(data);
            let commitsRate = [];
            let commits = [];
            let allCommits = [];
            const repositories = data.viewer.repositories.nodes;

            if (repositories) {
              repositories.map(el => {
                if (el.defaultBranchRef) {
                  commits.push(el.defaultBranchRef.target.history.nodes);
                }
              });
            }

            console.log(commits);

            commits.map(el => {
              if (el) {
                el.map(el => {
                  const date = el.authoredDate.substring(0, 10);
                  // console.log(date);
                  commitsRate[date]
                    ? (commitsRate[date] += 1)
                    : (commitsRate[date] = 1);
                });
                //   allCommits.push(el);
                // }

                // console.log(el[idx][idx].authoredDate);
              }
            });

            console.log(commitsRate);

            return <h1>Test</h1>;
          }
          return null;
        }}
      </Query>
    </>
  );
};
