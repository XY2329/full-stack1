//export things to pass to the types field in the graphql schema

import { extendType, intArg, objectType, stringArg } from "nexus";
import { User } from "./User";

export const Link = objectType({
    name: 'Link',       //the name of this object type, n will reflected in schema.graphql
    definition(t) {
        t.int('id');
        t.string('title');
        t.string('url');
        t.string('description');
        t.string('imageUrl');
        t.string('category');
        //a list for a field called users, and it's an array
        t.list.field('users', {
            type: User,
            //define this resolver to define how we can get these users
            async resolve(parent, _args, ctx) {
                return await ctx.prisma.link
                    .findUnique({
                        where: {
                            id: parent.id
                        }
                    })
                    .users()
                    .then(users => users.map(user => ({
                        ...user,
                        id: parseInt(user.id, 10) // Convert id from string to number
                    })));
            }
        });
    }
})

//以下3个export是for pagination
export const Edge = objectType({
    name: 'Edge',
    definition(t) {     //each edge object type will hv 2 fields
        t.string('cursor');
        t.field('node', {
            type: Link
        })
    }
})

export const PageInfo = objectType({
    name: 'PageInfo',
    definition(t) {
        t.string('endCursor');
        t.boolean('hasNextPage');
    }
})

export const Response = objectType({
    name: 'Response',
    definition(t) {
        t.field('pageInfo', { type: PageInfo });
        t.list.field('edges', { type: Edge })
    }
})
//client sends a request, req can be 1st req. this 1st req is when u go to the webpg, eg localhost:3000, u wan it to fetch certain amt of links
//client ady sent an initial request, n wan to fetch more data. so, send 2nd req, which contain a cursor

//define query using Nexus
//extendType: a function from Nexus, to extend the query type
//attach a new field called links to the query type
export const LinksQuery = extendType({
    type: 'Query',
    definition(t) {
        t.field('links', {
            type: Response,
            args: {
                first: intArg(),        //FIRST ARGU
                after: stringArg()
            },
            async resolve(_, args, ctx) {
                let queryResults = null;
                if (args.after) {       //chk if theres a cursor as the argument          
                    queryResults = await ctx.prisma.link.findMany({     //thn str8 get results
                        take: args.first,   //num of items to return from database
                        skip: 1,    //skip the cursor
                        cursor: {
                            id: parseInt(args.after)    //the cursor
                        }
                    });
                } else {
                    //if no cursor, means this is 1st request
                    //hence return 1st item in the database
                    queryResults = await ctx.prisma.link.findMany({
                        take: args.first
                    });
                }
                //so, the resolver, 1st chk if the req has any cursor. if yes, thn jump to the cursor n return the amt of items needed to returned(specified in FIRST ARGU, refer up thr)
                //if no cursor, thn return the 1st item in the database
                //above is the PART 1 of pagination


                //PART 2  of pagination
                //if the initial request returns links, thn 1st, get the last element in prev result
                if (queryResults.length > 0) {
                    const lastLinkInResults = queryResults[queryResults.length - 1];
                    //cursor return in subsequent requests
                    const myCursor = lastLinkInResults.id;

                    //query after cursor to check if theres next pg
                    const secondQueryResults = await ctx.prisma.link.findMany({
                        take: args.first,
                        cursor: {
                            id: myCursor
                        }
                    })

                    //return response
                    const result = {
                        pageInfo: {
                            endCursor: myCursor,
                            hasNextPage: secondQueryResults.length >= args.first,
                            //if num of items requested is greater than response of 2nd query, thrs next page
                        },
                        edges: queryResults.map(link => ({
                            cursor: link.id,
                            node: link
                        }))
                    }
                    return result;
                }

                //if queryResults less than 0, then str8 return this empty response object
                return {
                    pageInfo: {
                        endCursor: null,    //no end cursor
                        hasNextPage: false  //no next pages
                    },
                    edges: [],      //empty edges array
                }
            }
        });
    }
})


//summarise:
//1st, a null queryResults, n chk if thrs AfterArgument from the client
//if yes, thn str8 fetch the links from dbs starting from thr cursor, n fetch the amt of items that are define in 1st argu
//if no, thn it's the initial req, hence return the 1st item in the dbs

//thn, chk if thr is any results?
//if no, str8 return empty response object, cuz thrs no data in dbs
//if yes, thn chk if thrs next page to fetch
//to chk for more pgs, send another req to dbs while passing cursor of last item of initial req
// { hasNextPage: secondQueryResults.length >= args.first }
// if in args.1st, u asked for 10 items to return, but dbs only hv 2 left, thn secondQueryResults.length is lesser, it will say that thr r no more pgs to fetch