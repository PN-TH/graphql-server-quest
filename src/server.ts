import express from "express"
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql"

// GraphQL schema
const schema = buildSchema(`
    type Query {
        course(title: String!): [Course]
    },
    type Mutation {
      addCourse(title: String!, author: String!, description: String!, topic: String!, url: String!): [Course]
  }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

type Course = {
  id: number;
  title: string;
  author: string;
  description: string;
  topic: string;
  url: string;
};

const coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

const getCoursesByTitle = function(args: Course) { 
    const title = args.title;
    return coursesData.filter(course => {
        return course.title.includes(title)
    });
}

const addCourse = function({title, author, description, topic, url}: Course) {
  const newCourse = {id: coursesData.length + 1, title, author, description, topic, url}
  coursesData.push(newCourse)
  return coursesData;
}

const root = {
    course: getCoursesByTitle,
    addCourse: addCourse
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));

// GraphiQL Ex1

// query getSingleCourse($courseTitle: String!) {
//   course(title: $courseTitle) {
//       title
//       author
//       description
//       topic
//       url
//   }
// }

// Query Variables
// { 
//   "courseTitle": "Node.js"
// }

// GraphiQL ex2

// mutation addCourse($title: String!, $author: String!, $description: String! $topic: String!, $url: String!) {
//   addCourse(title: $title, author: $author, description: $description, topic: $topic, url: $url) {
//     id
//     title
//     author
//     description
//     topic
//     url
//   }
// }

// Query Variables
// { 
//   "title": "bbbbb",
//   "author": "bbbb",
//   "description": "bbbb",
//   "topic": "bbbbb",
//   "url": "bbbb"
// }
