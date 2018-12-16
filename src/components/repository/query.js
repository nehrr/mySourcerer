import gql from "graphql-tag";

export const GET_REPO_INFOS = gql`
  query($cursorUp: String, $nb: Int!, $cursorDown: String) {
    viewer {
      repositories(
        first: $nb
        orderBy: { field: CREATED_AT, direction: DESC }
        after: $cursorUp
        ownerAffiliations: OWNER
        before: $cursorDown
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
