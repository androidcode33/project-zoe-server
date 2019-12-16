import express from 'express'
import * as  path from 'path'
import mongoose from "mongoose"
import bluebird from "bluebird"
import cors from "cors"
import logger from "morgan"
import passport from "passport";
import './modules/security/auth/passport.setup'

import authRouter from "./modules/security/auth/auth.router"
import usersRouter from "./modules/security/users/users.router"
import userGroupRouter from "./modules/security/usergroup/usergroup.router"
import tasksRouter from "./modules/tasks/tasksRouter"
import groupRouter from "./modules/groups/group.router"
import contactRouter from "./modules/crm/contacts/contact.router"
import personRouter from "./modules/crm/routes/person.router"
import phoneRouter from "./modules/crm/routes/phone.router"
import addressRouter from "./modules/crm/routes/address.router"
import emailRouter from "./modules/crm/routes/email.router"
import identificationRouter from "./modules/crm/routes/identification.router"
import occasionRouter from "./modules/crm/routes/occasion.router"
import relationshipRouter from "./modules/crm/routes/relationship.router"

import {authorize, handleErrors} from './utils/middleware'
import {seedDataAsync} from "./data/seed";

const app = express();
mongoose.Promise = bluebird;
const mongoUrl: string = process.env.MONGO_URL || "mongodb://localhost:27017/angie-server";
if (mongoUrl.length === 0) {
    console.log(`Invalid mongo url: ${mongoUrl}`)
}
mongoose.set('debug', true);
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true}).then(
    async () => {
        await seedDataAsync()
    },
).catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err)
})
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, '../public')))

app.use('/api/auth', authRouter)
app.use('/api/users', authorize, usersRouter)
app.use('/api/user-groups', authorize, userGroupRouter)
app.use('/api/tasks', authorize, tasksRouter)
app.use('/api/groups', authorize, groupRouter)
app.use('/api/crm/contact', authorize, contactRouter)
app.use('/api/crm/person', authorize, personRouter)
app.use('/api/crm/phone', authorize, phoneRouter)

app.use('/api/crm/address', authorize, addressRouter)
app.use('/api/crm/email', authorize, emailRouter)
app.use('/api/crm/identification', authorize, identificationRouter)
app.use('/api/crm/occasion', authorize, occasionRouter)
app.use('/api/crm/relationship', authorize, relationshipRouter)

//Global Error handling
app.use(handleErrors)

export default app