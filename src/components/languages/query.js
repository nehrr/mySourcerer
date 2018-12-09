import gql from "graphql-tag";

export const GET_LANGUAGES = gql`
  query($nb: Int!) {
    viewer {
      repositories(last: $nb) {
        nodes {
          name
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
          languages(first: $nb) {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`;
