import gql from "graphql-tag";

export const GET_REPO_INFOS = gql`
  query($name: String!, $nb: Int!) {
    viewer {
      repository(name: $name) {
        name
        description
        resourcePath
        isPrivate
        collaborators {
          totalCount
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
    }
  }
`;
