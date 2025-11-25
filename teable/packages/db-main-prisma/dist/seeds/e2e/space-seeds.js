"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceSeeds = exports.generateCollaborator = void 0;
const seed_abstract_1 = require("../seed.abstract");
const user_seeds_1 = require("./user-seeds");
const userId = 'usrTestUserId';
const spaceId = 'spcTestSpaceId';
const spaceName = 'test space';
const baseId = 'bseTestBaseId';
const baseName = 'test base';
const collaboratorId = 'usrTestCollaboratorId';
const generateSpace = () => {
    return {
        id: spaceId,
        name: spaceName,
        createdBy: userId,
        lastModifiedBy: userId,
    };
};
const generateBase = () => {
    return {
        id: baseId,
        name: baseName,
        order: 1,
        createdBy: userId,
        space: {
            connect: {
                id: spaceId,
            },
        },
        lastModifiedBy: userId,
    };
};
const generateCollaborator = async (connectUserNum) => {
    const userSets = await (0, user_seeds_1.generateUser)(connectUserNum);
    return Array.from({ length: connectUserNum + 1 }, (_, i) => ({
        id: `${collaboratorId}_${i}`,
        resourceId: spaceId,
        resourceType: 'space',
        roleName: 'owner',
        principalId: userSets[i].id,
        principalType: 'user',
        createdBy: userSets[i].id,
    }));
};
exports.generateCollaborator = generateCollaborator;
class SpaceSeeds extends seed_abstract_1.AbstractSeed {
    execute = async () => {
        await this.prisma.$transaction(async (tx) => {
            // Space
            await this.createSpace(tx);
            // Base
            await this.createBase(tx);
            // Collaborator
            await this.createCollaborator(tx);
        });
    };
    async createSpace(tx) {
        const { id: spaceId, ...spaceNonUnique } = generateSpace();
        const space = await tx.space.upsert({
            where: { id: spaceId },
            update: spaceNonUnique,
            create: { id: spaceId, ...spaceNonUnique },
        });
        this.log('UPSERT', `Space ${space.id} - ${space.name}`);
    }
    async createBase(tx) {
        const { id: baseId, ...baseNonUnique } = generateBase();
        const base = await tx.base.upsert({
            where: { id: baseId },
            update: baseNonUnique,
            create: { id: baseId, ...baseNonUnique },
        });
        this.log('UPSERT', `Base ${base.id} - ${base.name}`);
        if (this.driver !== 'sqlite3') {
            await tx.$executeRawUnsafe(`create schema if not exists "${baseId}"`);
            await tx.$executeRawUnsafe(`revoke all on schema "${baseId}" from public`);
        }
    }
    async createCollaborator(tx) {
        const collaboratorSets = await (0, exports.generateCollaborator)(user_seeds_1.CREATE_USER_NUM);
        for (const c of collaboratorSets) {
            const { id, resourceId, principalId, ...collaboratorNonUnique } = c;
            const collaborator = await tx.collaborator.upsert({
                where: { id, resourceId, resourceType: 'space', principalId },
                update: collaboratorNonUnique,
                create: c,
            });
            this.log('UPSERT', `Collaborator ${collaborator.id} - ${collaborator.resourceId} - ${collaborator.principalId}`);
        }
    }
}
exports.SpaceSeeds = SpaceSeeds;
