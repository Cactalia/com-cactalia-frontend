/*
 * Token
 * DESCRIPCIÓN: Clase que define las propiedades del payload del JWT del usuario autenticado.
 * FECHA DE CREACIÓN: 20/11/2020
 * CREADO POR: Oscar Emmanuel Lechuga Velázquez
 */
export class Token {
    names: string;
    lastname: string;
    secondLastName: string;
    email: string;
    authorities: string[];  
    user_name: string;
    exp: number;  
}