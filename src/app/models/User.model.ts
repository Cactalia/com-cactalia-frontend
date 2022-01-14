/*
 * User
 * DESCRIPCIÓN: Clase que define las propiedades de los usuarios del sistema.
 * FECHA DE CREACIÓN: 17/11/2020
 * CREADO POR: Oscar Emmanuel Lechuga Velázquez
 */
import { Degree } from "./Degree.model";
import { Role } from "./role.model";

export class User{
    id: number;
    email: string;
    username: string;
    password: string;
    name: string;
    lastname: string;
    secondLastname: string;
    grade:string;
    roles: Role[];
    degrees: Degree[];
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
    constructor(id:number,name:string,lastname:string,secondLastname:string,email:string,grade:string,password:string){
        this.id=id;
        this.name= name;
        this.lastname= lastname;
        this.secondLastname= secondLastname;
        this.email= email;
        this.grade= grade;
        this.password= password;
    }
}