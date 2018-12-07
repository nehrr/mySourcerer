import gql from "graphql-tag";

export const GET_DATA = gql`
  query($nb: Int!) {
    viewer {
      avatarUrl
      login
      name
      bio
      location
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

export const GET_REPO = gql`
  query($nb: Int!) {
    viewer {
      repositories(first: $nb) {
        nodes {
          nameWithOwner
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  }
`;
