import { createTable, deleteTable, permanentDeleteTable } from '@teable/openapi';
export class Base {
    id;
    name;
    spaceId;
    icon;
    role;
    collaboratorType;
    restrictedAuthority;
    constructor(base) {
        const { id, name, spaceId, icon, role, collaboratorType, restrictedAuthority } = base;
        this.id = id;
        this.name = name;
        this.spaceId = spaceId;
        this.icon = icon;
        this.role = role;
        this.collaboratorType = collaboratorType;
        this.restrictedAuthority = restrictedAuthority;
    }
    async createTable(tableRo) {
        return createTable(this.id, tableRo);
    }
    async deleteTable(tableId, permanent) {
        return permanent ? permanentDeleteTable(this.id, tableId) : deleteTable(this.id, tableId);
    }
}
