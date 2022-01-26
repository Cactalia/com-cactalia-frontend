/*
 * User
 * DESCRIPCIÓN: Clase que define las propiedades de los usuarios del sistema.
 * FECHA DE CREACIÓN: 17/11/2020
 * CREADO POR: Oscar Emmanuel Lechuga Velázquez
 */
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