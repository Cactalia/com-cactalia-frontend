import { Role } from "./role.model";

export class User{
    id: string;
    names: string;
    lastName: string;
    secondLastName: string;
    email: string;
    phoneNumber: number;
    password: string;
    role: Role;
    access_token:string;
}