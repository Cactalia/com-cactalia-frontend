import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  alertError(error: any){
    if (error.error.errors==null){
      Swal.fire({
        imageUrl: '../../assets/img/error/dificultadesTecnicas.jpg',
        imageWidth: 120,
        imageHeight: 100,
        title: 'Oops... Dificultades técnicas.',
        text: 'Intentalo nuevamente. Si el problema persiste, repórtelo.',
        confirmButtonColor: '#55919e',
        cancelButtonColor: '#9b9b9b',
      });
    }else{
      let errors:Error[]=error.error.errors;
      let message = Array.prototype.map.call(errors, function(item) { return item.message; });
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#55919e',
      });
    }
  }


  alertSuccess(message:string){
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      confirmButtonColor: '#55919e',
      cancelButtonColor: '#9b9b9b',
    });
  }
}
