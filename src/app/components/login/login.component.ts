import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/Login.model';
import { Error } from 'src/app/models/Error.model';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading:boolean=false;
  loginForm: FormGroup;
  myControl: FormControl = new FormControl();

  constructor(
    private router: Router,
    private userFB: FormBuilder,
    private loginService: LoginService,
    private userService: UserService,
  ) { }

  /**
   * Al iniciar el componente valida que no exista un token almacenado
   * de lo contrario redirige al inicio de la aplicación
   */
  ngOnInit(): void {
    this.loginForm = this.userFB.group({
      email: ['', [Validators.maxLength(100), Validators.email, Validators.required]],
      password: ['', [Validators.maxLength(100), Validators.required]],
    });

    if (typeof (Storage) !== 'undefined') {
      if(localStorage.getItem(environment.authTokenKey)!=null){
        this.router.navigateByUrl("/");
      }
    }
  }

   /**
   * login
   * Método ejecutado al presionar el botón "Ingresar" del componente login
   */
  login() {    
    this.loading=true;
    const controls = this.loginForm.controls;

    if (this.loginForm.valid) {
      this.loginService.login(controls.email.value, controls.password.value).subscribe(
        response => {
          let token: Login = response;
          this.loading=false;
          if (typeof (Storage) !== 'undefined') {
            localStorage.setItem(environment.authTokenKey, token.access_token);
            this.router.navigateByUrl("/");
          }
        },
        error => {
          this.loading=false;
          if (error==null){
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
            let errors:Error[]=error;
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
      );
    }
  }

  async restorePassword() {
    const { value: email } = await Swal.fire({
      html:'<h3>Restablecer contraseña</h3>'+
          '<p>Se enviará una nueva contraseña por correo electrónico si existe una cuenta asociada.</p>',
      input: 'email',
      inputPlaceholder: 'Correo electrónico',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: '#55919e',
      cancelButtonColor: '#9b9b9b',
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!re.test(String(value).toLowerCase())) {
            resolve('Correo electrónico inválido.')
          }else{
            resolve('')
          }
        })
      }
    })    
    if (email) {
      this.userService.resetPassword(email).subscribe(
        response =>{
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Solicitud enviada correctamente.',
            confirmButtonColor: '#55919e',
            cancelButtonColor: '#9b9b9b',
            confirmButtonText: 'Cerrar',
          });
        }
      );
    }
  }
}
