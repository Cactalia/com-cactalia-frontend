import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/Login.model';
import { Error } from 'src/app/models/Error.model';
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
              confirmButtonColor: '#e66587',
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
              confirmButtonColor: '#e66587',
            });
          }
        }
      );
    }
  }

}