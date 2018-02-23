// Some fake data
const books = [
  {
    id: 1,
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
  },
  {
    id: 2,
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const users = [
  { id: 1, username: 'Ryan' },
  { id: 2, username: 'User 2' },
  { id: 3, username: 'User 3' },
];

// fake network request
const mockFetchUser = (id) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const user = users.find(user => parseInt(user.id) === parseInt(id));

        resolve(user);
      }, 1000);

    } catch (e) {
      reject(e);
    }
  });
}

// The resolvers connects queries with db and backend services - usually in the form of a promise
const resolvers = {
  Query: {
    books: () => books,
    users: () => users,
    user: (root, { id }) => mockFetchUser(id),
  },
  Mutation: {
    createUser: (root, { username, password }, context, info) => {
      // mock db insert
      const id = users.length;
      const user = { id, username, password };
      users.push(user);

      return user;
    }
  },
};
