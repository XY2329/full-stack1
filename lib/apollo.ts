import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
    //here will take objects, where in this case is specified into 2 fields
    uri:"http://localhost:3000/api/graphql", //the url of graphql endpoint that we're interacting with
    cache: new InMemoryCache(),
})

export default apolloClient