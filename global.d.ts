import { PrismaClient } from '@prisma/client';

declare global {
    // This extends the global object to include the prisma property
    namespace NodeJS {
        interface Global {
            prisma: PrismaClient;
        }
    }
}

// To avoid TypeScript errors related to module augmentation
export { };
