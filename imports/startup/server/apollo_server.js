import { createApolloServer } from 'meteor/apollo'
import { schema } from '../../graphql/index'

createApolloServer({ schema })
