"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSeeds = exports.generateUser = exports.CREATE_USER_NUM = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcrypt_1 = __importDefault(require("bcrypt"));
const seed_abstract_1 = require("../seed.abstract");
exports.CREATE_USER_NUM = 1;
const generatePassword = async (password) => {
    const salt = await bcrypt_1.default.genSalt(10);
    const hashPassword = await bcrypt_1.default.hash(password, salt);
    return { salt, password: hashPassword };
};
const createUser = (baseId, baseName, pas, index) => {
    const id = index === undefined ? baseId : `${baseId}_${index}`;
    return {
        id,
        name: index === undefined ? baseName : `${baseName}_${index}`,
        email: index === undefined ? `${baseName}@e2e.com` : `${baseName}_${index}@e2e.com`,
        salt: pas.salt,
        password: pas.password,
        notifyMeta: JSON.stringify({ email: true }),
        avatar: `avatar/${id}`,
        isAdmin: index === undefined,
    };
};
const generateUser = async (max) => {
    const userId = 'usrTestUserId';
    const userName = 'test';
    const pas = await generatePassword('12345678');
    return Array.from({ length: max + 1 }, (_, i) => createUser(userId, userName, pas, i === 0 ? undefined : i));
};
exports.generateUser = generateUser;
class UserSeeds extends seed_abstract_1.AbstractSeed {
    execute = async () => {
        const userSets = await (0, exports.generateUser)(exports.CREATE_USER_NUM);
        for (const u of userSets) {
            const { id, name, email, ...userNonUnique } = u;
            const user = await this.prisma.user.upsert({
                where: { email },
                update: userNonUnique,
                create: u,
            });
            this.log('UPSERT', `User ${user.id} - ${user.email} - ${user.password}`);
        }
    };
}
exports.UserSeeds = UserSeeds;
