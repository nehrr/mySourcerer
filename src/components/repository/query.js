import gql from "graphql-tag";

export const GET_REPO_INFOS_SELF = gql`
  query(
    $cursorUp: String
    $first: Int
    $last: Int
    $cursorDown: String
    $nb: Int!
    $login: String!
  ) {
    user(login: $login) {
      repositories(
        first: $first
        orderBy: { field: CREATED_AT, direction: DESC }
        after: $cursorUp
        before: $cursorDown
        last: $last
        ownerAffiliations: OWNER
      ) {
        nodes {
          name
          description
          resourcePath
          isPrivate
          collaborators(first: $nb) {
            totalCount
            nodes {
              avatarUrl
              login
            }
          }
          languages(first: $nb) {
            nodes {
              name
            }
          }
          ... on Repository {
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
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

export const GET_REPO_INFOS_OTHERS = gql`
  query(
    $cursorUp: String
    $first: Int
    $last: Int
    $cursorDown: String
    $nb: Int!
    $login: String!
  ) {
    user(login: $login) {
      repositories(
        first: $first
        orderBy: { field: CREATED_AT, direction: DESC }
        after: $cursorUp
        before: $cursorDown
        last: $last
        ownerAffiliations: OWNER
      ) {
        nodes {
          name
          description
          resourcePath
          isPrivate
          languages(first: $nb) {
            nodes {
              name
            }
          }
          ... on Repository {
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
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;
