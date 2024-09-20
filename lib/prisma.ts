// contain the Prisma instance
// bcuz next js has fast referesh, so everytime u save, it will create a new instance of prisma client
// this will very quickly exhaust the connection limit for database

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

//1st check if in prpoduction, if yes, then create a new instance of prisma client
if (process.env.NODE_ENV == 'production') {
    prisma = new PrismaClient();
} else {    //if not, then attach the prisma instance to the global object
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
//doing this can prevent reinitialise prisma client when hit save again
//will only use the one attahced to the global object
    prisma = global.prisma;
}

export default prisma;