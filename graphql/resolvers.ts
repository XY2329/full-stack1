//schema.ts只是define schema而已 还没有implementation detail
//用resolvers来写implementatiom
export const resolvers = {
    Query:{
        //args: contains all variables that are passed to query or mutation
        links: async (_parent, args, context) => await context.prisma.link.findMany(),
    }
}