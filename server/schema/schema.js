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
  GraphQLNonNull,
  GraphQLEnumType,
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

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    /*  Example Mutation to add a Client
     *  mutation {
     *    addClient(name: "Peter Parker", email:"spiderman@gmail.com", phone: "111-111-2222") {
     *      id
     *      name
     *      email
     *      phone
     *    }
     *  }
     */
    addClient: {
      type: ClientType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        // email: { type: GraphQLString },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });

        return client.save();
      },
    },

    /* Example mutation to Delete a Client
     * mutation {
     *  deleteClient(id: "63f7e7b478de9dfbf26b49a6") {
     *    name
     *  }
     * }
     */
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id);
      },
    },
    // deleteClient: {
    //   type: ClientType,
    //   args: {
    //     id: { type: GraphQLNonNull(GraphQLID) },
    //   },
    //   resolve(parent, args) {
    //     Project.find({ clientId: args.id }).then((projects) => {
    //       projects.forEach((project) => {
    //         project.remove();
    //       });
    //     });

    //     return Client.findByIdAndRemove(args.id);
    //   },
    // },

    // Add a project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
          defaultValue: 'Not Started',
        },
        clientId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });

        return project.save();
      },
    },

    // Delete a Project
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Project.findByIdAndRemove(args.id);
      },
    },

    // Update a project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdate',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
        },
      },

      resolve(parent, args) {
        return Project.findByIdAndUpdate(args.id, {
          $set: {
            name: args.name,
            description: args.description,
            status: args.status,
          },
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
