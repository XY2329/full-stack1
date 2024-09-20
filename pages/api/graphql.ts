// to create graphql endpoint, 1st nid import apollo server

import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "../../graphql/schema";
import { resolvers } from "../../graphql/resolvers";
import { createContext } from "../../graphql/context";
import Cors from 'micro-cors'

const cors = Cors()

const apolloServer = new ApolloServer({ typeDefs, resolvers, context:createContext});

//a function to start the server, a req for apollo server 3
const startServer = apolloServer.start()

// now nextjs is still not aware of this endpoint, hence nid to make a default export
export default cors(async function handler(req, res) {   //req: request, res: response
    if(req.method=='OPTIONS'){
        res.end();
        return false ;
    }
    
    //start the server before handling request
    await startServer
   
    //handle req
    await apolloServer.createHandler({
        path:'/api/graphql'     //path of graphql server
    })(req,res);
})

export const config= {
    api:{
        bodyParser:false
    }
}