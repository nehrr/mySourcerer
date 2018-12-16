import gql from "graphql-tag";

export const GET_DATA = gql`
  query($nb: Int!, $cursor: String) {
    viewer {
      avatarUrl(size: 250)
      login
      name
      bio
      location
      repositories(
        first: $nb
        orderBy: { field: CREATED_AT, direction: DESC }
        after: $cursor
      ) {
        totalCount
        nodes {
          name
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  nodes {
                    authoredDate
                  }
                  totalCount
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
      followers(first: $nb) {
        nodes {
          login
        }
      }
      following(first: $nb) {
        nodes {
          login
        }
      }
    }
  }
`;
