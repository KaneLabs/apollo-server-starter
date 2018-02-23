export default `
  type Book { id: ID!, title: String, author: String }
  type User { id: ID!, username: String }
  type Query {
    books: [Book]
    users: [User]
    user(id: ID!): User
  }
  type Mutation {
    createUser(
      username: String!
      password: String!
    ): User
  }
`;
