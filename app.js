const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input UserInput {
            email: String!
            password: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: async () => {
            try {
                const events = await Event.find();
                return events.map(event => {
                    return { ...event._doc, _id: event._doc._id.toString() };
                });
            }
            catch (err) {
                throw err;
            }
        },
        createEvent: async (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5d19ed9bac542a2184bb4f61'
            });

            try {
                const result = await event.save();
                createdEvent = { ...result._doc, _id: result._doc._id.toString() };

                const user = await User.findById('5d19ed9bac542a2184bb4f61');

                if (!user) throw new Error('User not found');

                user.createdEvents.push(event);
                user.save();

                return { ...result._doc, _id: result._doc._id.toString() };
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        },
        createUser: async (args) => {
            try {
                const existingUser = await User.findOne({ email: args.userInput.email });
                if (existingUser) throw new Error('User already exists');
                    const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
                    const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                const result = await user.save();
                console.log(result);
                return { ...result._doc, _id: result.id, password: null };
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-nlmvj.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(
    () => {
        app.listen(3000)
    }
).catch(
    err => {
        console.log(err)
    }
)
