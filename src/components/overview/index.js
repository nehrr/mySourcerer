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
            let commitsRate = [];
            let commits = [];
            let dataAll = [];
            let labels = [];
            const repositories = data.viewer.repositories.nodes;

            if (repositories) {
              repositories.map(el => {
                if (el.defaultBranchRef) {
                  commits.push(el.defaultBranchRef.target.history.nodes);
                }
              });
            }

            commits.map(el => {
              if (el) {
                el.map(el => {
                  const date = el.authoredDate.substring(0, 7);
                  commitsRate[date]
                    ? (commitsRate[date] += 1)
                    : (commitsRate[date] = 1);
                });
              }
            });

            for (var date in commitsRate) {
              if (commitsRate.hasOwnProperty(date)) {
                labels.push(date);
                dataAll.push(commitsRate[date]);
              }
            }

            const dataLine = {
              labels,
              datasets: [
                {
                  fill: false,
                  label: "Commiting Rate",
                  lineTension: 0.1,
                  backgroundColor: "#255e7e",
                  borderColor: "#7faac6",
                  borderCapStyle: "butt",
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: "miter",
                  pointBorderColor: "#7faac6",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "#7faac6",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: dataAll
                }
              ]
            };

            return <Line data={dataLine} />;
          }
          return null;
        }}
      </Query>
    </>
  );
};
