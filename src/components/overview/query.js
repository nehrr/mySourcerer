import gql from "graphql-tag";

export const GET_OVERVIEW = gql`
  query($nb: Int!) {
    viewer {
      repositories(last: $nb, orderBy: { field: CREATED_AT, direction: ASC }) {
        nodes {
          name
          languages(first: $nb) {
            nodes {
              name
            }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  nodes {
                    authoredDate
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
