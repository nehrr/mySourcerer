import gql from "graphql-tag";

export const GET_REPO_INFOS = gql`
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
        orderBy: { field: UPDATED_AT, direction: DESC }
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
          url
          collaborators(first: $nb) {
            totalCount
            nodes {
              avatarUrl
              login
              url
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
                      message
                      additions
                      deletions
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
