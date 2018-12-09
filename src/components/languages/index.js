import React from "react";
import { Query } from "react-apollo";
import { Spinner } from "evergreen-ui";
import { GET_LANGUAGES } from "./query";

export default ({ variables }) => {
  const { nb } = variables;
  //commits by language = nb of commits in a repo * each language

  return (
    <Query query={GET_LANGUAGES} variables={{ nb }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Spinner />;
        }

        if (data) {
          let languagesData = {};
          let sortedData = [];
          const repositories = data.viewer.repositories.nodes;

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

          return (
            <>
              {sortedData.map((el, idx) => {
                return (
                  <div key={idx}>
                    {el[0]} || {el[1]}
                  </div>
                );
              })}
            </>
          );
        }

        return null;
      }}
    </Query>
  );
};
