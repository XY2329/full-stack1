import { makeSchema } from "nexus";
import { join } from "path";

export const schema = makeSchema({
    types:[],
    outputs:{
        typegen: join(
            process.cwd(),
            'node_modules',
            '@types',
            'nexus-typegen',
            'index.d.ts'
        ),
        schema: join
    }
})


//define graphql schema for the app
//define schema using STRING has downside like cant detect typo errors

/*
import {gql} from "apollo-server-micro";

export const typeDefs = gql`
#object type: is like an object the API can return
#here u got a Link object type to be able to return a link
    type Link{      
        id: String
        title: String
        description: String
        url: String
        category: String
        imageUrl: String
        users: [String]
    }

    #query type is a special type
    #this is the entry point for GraphQL API
    #for read operations, where u only requesting data
    type Query{
        links: [Link]!     # !: means query is non-nullable
    }

    #for other operations: create, update, delete use type Mutation


    
`;
*/