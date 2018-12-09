import React from "react";
import moment from "moment";
import { Pie } from "react-chartjs-2";
import { Query } from "react-apollo";
import { Spinner } from "evergreen-ui";
import { GET_LANGUAGES } from "./query";

export default ({ variables }) => {
  const { nb } = variables;

  return (
    <Query query={GET_LANGUAGES} variables={{ nb }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Spinner />;
        }

        if (data) {
          let languagesData = {};
          let sortedData = [];
          let labels = [];
          let dataAll = [];
          const repositories = data.viewer.repositories.nodes;
          let latestCommit = moment(
            data.viewer.repositories.nodes[0].defaultBranchRef.target.history.nodes[0].authoredDate.toString()
          ).format("LLL");

          repositories.map(el => {
            const languages = el.languages.nodes;
            const commits = el.defaultBranchRef.target.history.totalCount;

            languages.map(el => {
              const { name } = el;
              languagesData[name]
                ? (languagesData[name] += commits)
                : (languagesData[name] = commits);
            });

            return languagesData;
          });

          for (var language in languagesData) {
            if (languagesData.hasOwnProperty(language)) {
              sortedData.push([language, languagesData[language]]);
            }
          }

          sortedData.sort((a, b) => {
            return b[1] - a[1];
          });

          for (const languageData of sortedData) {
            labels.push(languageData[0]);
            dataAll.push(languageData[1]);
          }

          const dataPie = {
            labels,
            datasets: [
              {
                data: dataAll
              }
            ]
          };

          return (
            <>
              {sortedData.map((el, idx) => {
                return (
                  <div key={idx}>
                    {el[0]} || {el[1]}
                  </div>
                );
              })}
              <Pie data={dataPie} />
              Lastest commit: {latestCommit}
            </>
          );
        }

        return null;
      }}
    </Query>
  );
};
