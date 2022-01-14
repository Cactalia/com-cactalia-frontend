/*
 * UserService
 * DESCRIPCIÓN: Clase que consume los servicios del backend referentes a los usuarios
 * FECHA DE CREACIÓN: 20/11/2020
 * CREADO POR: Oscar Emmanuel Lechuga Velázquez
 */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

const API_USER_URL = environment.apiHostname + 'api/user/v1';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /**
   * constructor
   * Método para inicializar el servicio
   * @param http cliente http
   */
  constructor(private http: HttpClient) { }

  /**
   * findUserById
   * Método que solicita al backend los datos de un usuario por su id
   * @param id id por buscar
   * @param role rol
   */
  findUserById(id: number, role: string): Observable<User> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<User>(API_USER_URL + '/find-by-id?id='+id+'&role='+role, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * alterUser
   * Método que envía el usuario a actualizar
   * @param user Usuario a modificar
   */
  alterUser(user: User) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.put<User>(API_USER_URL + "/alter", user, { headers }).pipe(
      catchError(e=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops!', 
          text: e.error.error.message.replaceAll(/~/g,""),
          confirmButtonColor: '#55919e',
          cancelButtonColor: '#9b9b9b',});
        return throwError("");
      })
    );
  }

  /**
   * resetPassword
   * Método que envía una nueva contraseña por correo electrónico.
   * @param email correo electrónico a enviar
   */
  resetPassword(email:string){
    return this.http.put(API_USER_URL + '/reset-password?email=' + email, null).pipe(
      catchError(e=>{
        Swal.fire({icon: 'error',title: 'Oops...', text:'Ha ocurrido un error al procesar su solicitud.',
        confirmButtonColor: '#55919e', cancelButtonColor: '#9b9b9b', confirmButtonText: 'Cerrar',});
        return throwError("");
      })
    );
  }

  /**
 * handleError
 * Método que retorna el error http suscitado
 * @param error error http
 */
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
