import type { Prisma } from '../../';
import { AbstractSeed } from '../seed.abstract';
export declare const CREATE_USER_NUM = 1;
export declare const generateUser: (max: number) => Promise<Prisma.UserCreateInput[]>;
export declare class UserSeeds extends AbstractSeed {
    execute: () => Promise<void>;
}
