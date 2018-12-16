import gql from "graphql-tag";

export const GET_LANGUAGES = gql`
  query($nb: Int!) {
    viewer {
      repositories(last: $nb, orderBy: { field: CREATED_AT, direction: DESC }) {
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
