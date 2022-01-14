/*
 * Token
 * DESCRIPCIÓN: Clase que define las propiedades del payload del JWT del usuario autenticado.
 * FECHA DE CREACIÓN: 20/11/2020
 * CREADO POR: Oscar Emmanuel Lechuga Velázquez
 */
export class Token {
    id:number;
    name: string;
    lastname: string;
    secondLastname: string;
    user_name: string;
    email: string;
    idGym: number;
    authorities: string[];  
    exp: number;  
}