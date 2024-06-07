import { registerEnumType } from "@nestjs/graphql";

export enum ValidRoles {
    ADMIN = 'ADMIN', //Control total
    USER = 'USER', //Rol del usuario del sistema
    EMPLOYEE_NV1 = 'EMPLOYEE_NV1', //Gestión de habitaciones y reservas
    EMPLOYEE_NV2 = 'EMPLOYEE_NV2', //Gestión de restaurante
    EMPLOYEE_NV3 = 'EMPLOYEE_NV3', //Gestión de atracciones
    DEV = 'DEV', //Control total también
    TEST = 'TEST', //Prueba
}

//Así lo reconoce GraphQL
registerEnumType( ValidRoles, { name: 'ValidRoles', description: 'Roles Permitidios.' })