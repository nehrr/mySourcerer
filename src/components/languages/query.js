import gql from "graphql-tag";

export const GET_LANGUAGES = gql`
  query($nb: Int!, $login: String!) {
    user(login: $login) {
      repositories(last: $nb, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          name
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  nodes {
                    authoredDate
                    additions
                    deletions
                  }
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
