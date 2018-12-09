import React from "react";
import moment from "moment";
import { Pie } from "react-chartjs-2";
import { Query } from "react-apollo";
import { Spinner, Pane } from "evergreen-ui";
import { GET_LANGUAGES } from "./query";

const backgroundColor = [
  "#004c6d",
  "#255e7e",
  "#3d708f",
  "#5383a1",
  "#6996b3",
  "#7faac6",
  "#94bed9",
  "#abd2ec",
  "#c1e7ff",
  "#c4eaff"
];
let idx = 0;

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
              if (sortedData.length < 9) {
                sortedData.push([language, languagesData[language]]);
                idx++;
              }
            }
          }

          sortedData.sort((a, b) => {
            return b[1] - a[1];
          });

          for (let i = 0; i < sortedData.length; i++) {
            sortedData[i][2] = backgroundColor[i];
            idx++;
          }

          for (const languageData of sortedData) {
            labels.push(languageData[0]);
            dataAll.push(languageData[1]);
          }

          const dataPie = {
            labels,
            datasets: [
              {
                data: dataAll,
                backgroundColor
              }
            ]
          };

          return (
            <Pane
              flexDirection="column"
              background="tint1"
              border="muted"
              marginBottom={24}
            >
              <Pane
                float="left"
                width={300}
                justifyContent="center"
                alignItems="center"
              >
                {sortedData.map((el, idx) => {
                  return (
                    <Pane
                      is="section"
                      backgroundColor={el[2]}
                      border="muted"
                      width={90}
                      height={90}
                      float="left"
                      margin={5}
                      padding={5}
                      flexDirection="row"
                    >
                      <p
                        style={{
                          fontSize: "10px",
                          align: "center",
                          position: "relative"
                        }}
                      >
                        {el[0]} <br /> {el[1]} commits <br /> LOC
                      </p>
                    </Pane>
                  );
                })}
              </Pane>
              <Pane float="right" width={500} marginBottom={24}>
                <Pie data={dataPie} legend={{ display: false }} />
                <br />
                Lastest commit: {latestCommit}
              </Pane>
            </Pane>
          );
        }

        return null;
      }}
    </Query>
  );
};
