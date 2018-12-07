import gql from "graphql-tag";

export const GET_REPO_INFOS = gql`
  query($name: String!) {
    viewer {
      repository(name: $name) {
        name
      }
    }
  }
`;
