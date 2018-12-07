import React from "react";
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
          let languagesList = [];
          const repositories = data.viewer.repositories.nodes;

          repositories.map(el => {
            const languages = el.languages.nodes;
            languages.map(el => {
              const { name } = el;
              if (!languagesList.includes(name)) {
                languagesList.push(name);
              }
            });
            return languagesList;
          });

          console.log(languagesList);

          return (
            <>
              {languagesList.map((el, idx) => {
                return <div key={idx}>{el}</div>;
              })}
            </>
          );
        }

        return null;
      }}
    </Query>
  );
};
