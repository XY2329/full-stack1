import { PrismaClient } from '@prisma/client';
import prisma from "../lib/prisma"

export type Context = {
    prisma:PrismaClient;
}

//a function that creates a new context object and will be passed to Apollo Server
export async function createContext(req,res): Promise<Context>{
    return {
        prisma
    }
}