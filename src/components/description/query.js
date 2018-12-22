import gql from "graphql-tag";

export const GET_DATA = gql`
  query($nb: Int!, $login: String!) {
    user(login: $login) {
      avatarUrl(size: 250)
      login
      name
      bio
      url
      location
      repositories(
        first: $nb
        orderBy: { field: UPDATED_AT, direction: DESC }
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
