import { gql } from '@apollo/client';

const GET_PROJECTS = gql`
  query geteProjects {
    projects {
      id
      name
      status
    }
  }
`;

const GET_PROJECT = gql`
  query geteProjects($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      client {
        id
        name
        email
        phone
      }
    }
  }
`;

export { GET_PROJECTS, GET_PROJECT };
