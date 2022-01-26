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
    roles: Role[];
    access_token:string;

    /**
     * constructor
     * Método para inicializar un objeto de tipo User
     * @param id id
     * @param name nombre
     * @param lastname apellido materno
     * @param secondLastname apellido paterno
     * @param email correo electrónico
     * @param grade grado del profesor
     * @param password contraseña
     */
    constructor(id:string,name:string,lastname:string,secondLastname:string,email:string,grade:string,password:string){
        this.id=id;
        this.names= name;
        this.lastName= lastname;
        this.secondLastName= secondLastname;
        this.email= email;
        this.password= password;
    }
}