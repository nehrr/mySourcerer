import gql from "graphql-tag";

export const GET_DATA = gql`
  query($nb: Int!) {
    viewer {
      avatarUrl(size: 250)
      login
      name
      bio
      location
      repositories(ownerAffiliations: OWNER) {
        totalCount
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

export const GET_REPO = gql`
  query($nb: Int!) {
    viewer {
      repositories(
        first: $nb
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
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
    }
  }
`;
