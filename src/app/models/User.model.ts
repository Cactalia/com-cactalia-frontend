import { Role } from "./role.model";

export class User {
    id: string;
    names: string;
    lastName: string;
    secondLastName: string;
    email: string;
    phoneNumber: number;
    birthday: string;
    gender: string;
    points: number;
    password: string;
    role: Role;
    access_token: string;

    constructor(names: string, lastName: string, secondLastName: string, email: string, phoneNumber: number) {
        this.names = names;
        this.lastName = lastName;
        this.secondLastName = secondLastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }
}