import type { Prisma } from '../../';
import { AbstractSeed } from '../seed.abstract';
export declare const generateCollaborator: (connectUserNum: number) => Promise<Prisma.CollaboratorUncheckedCreateInput[]>;
export declare class SpaceSeeds extends AbstractSeed {
    execute: () => Promise<void>;
    private createSpace;
    private createBase;
    private createCollaborator;
}
