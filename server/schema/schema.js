// const { projects, clients } = require('../sampleData.js');

// Mongoose models
const Project = require('../models/Project');
const Client = require('../models/Client');

const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = graphql;

// Project Type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        // return clients.find((client) => client.id === parent.clientId);  // Gets Client from sample data file
        return Client.findById(parent.clientId); // Gets Client from mongoDB Database
      },
    },
  }),
});

// Client Type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    /*  Example Request to clients
     *  {
     *    projects {
     *      id
     *      name
     *      status
     *    }
     *  }
     */
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        // return projects;     // Gets Projects from sample data file
        return Project.find(); // Gets Projects from mongoose Database
      },
    },

    /* Example Request to project
     *  {
     *    project(id: "1") {
     *      id
     *      name
     *      description
     *      status
     *      client {
     *        name
     *        phone
     *      }
     *    }
     *  }
     */
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return projects.find((project) => project.id === args.id); // Gets Project from sample data file
        return Project.findById(args.id); // Gets Project from mongo Database
      },
    },

    /*  Example Request to clients
     *  {
     *    clients {
     *      id
     *      name
     *      phone
     *    }
     *  }
     */
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        // return clients; // Gets Clients from sample data file
        return Client.find(); // Gets Clients from mongoDB Database
      },
    },

    /* Example Request to client
     *  {
     *    client(id: "1") {
     *      id
     *      name
     *      phone
     *    }
     *  }
     */
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, args) {
        // return clients.find((client) => client.id === args.id); // Gets Client from sample data file
        return Client.findById(args.id); // Gets Client from mongoDB Database
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
