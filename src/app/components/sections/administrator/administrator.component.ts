import { Component, OnInit } from '@angular/core';
import { Token } from 'src/app/models/Token.model';
import { LoginService } from 'src/app/services/login.service';
import { UserAdminService } from 'src/app/services/userAdmin.service';
import { AlertService } from 'src/app/utils/alert.service';
import { environment } from 'src/environments/environment';
import  Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})
export class AdministratorComponent implements OnInit {

  private tokenUser: Token;

  private users: User[] = [];
  private totalElements:number;
  private actualPage:number;
  private maxPages:number;

  public newItemRequested: boolean = false;
  private loading: boolean = false;

  private newUserAdminForm: FormGroup;

  constructor(
    private router: Router,
    private userFB: FormBuilder,
    private loginService: LoginService,
    private userAdminService: UserAdminService,
    private errorAlertService: AlertService,
  ) {
    this.actualPage=0;
    this.maxPages=1;
  }

  ngOnInit(): void {
    this.newUserAdminForm = this.userFB.group({
      names: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      lastName: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      secondLastName: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],      
      email: ["", [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(99)]],
      phoneNumber: ["", [Validators.required, Validators.pattern("[0-9]*"), Validators.minLength(10), Validators.maxLength(10)]],
    });

    if (localStorage.getItem(environment.authTokenKey) == null) {
      this.router.navigateByUrl("/iniciar-sesion");
    }else{
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.getUserAdmins(this.actualPage);
    }
  }

  /**
  * getUserAdmins
  * Método que obtiene los administradores registrados.
  * Obtiene los administradores paginados
  * @param page número de pagina a obtener
  */
  getUserAdmins(page:number) {
    this.userAdminService.selectAll(page,5).subscribe(response => {
      this.users = response.page.content;
      this.maxPages= response.page.totalPages;
      this.actualPage= page;
      this.totalElements= response.page.totalElements;
    }, error => {
      this.errorAlertService.alertError(error);
    });
  }

  /**
   * newItemRequest
   * Método que permite la visualización del formulario de registro
   */
  newItemRequest() {
    this.newItemRequested = true;
  }

  /**
   * newItemRequestCancel
   * Método que desaparece y reinicia el formulario de registro
   */
   newItemRequestCancel() {
    this.newItemRequested = false;
    this.clear();
  }
  
  /**
   * clear
   * Método que reinicia el formulario de registro
   */
  clear() {
    this.newUserAdminForm.reset();
  }

  /**
   * newUserAdmin()
   * Método que registra un nuevo administrador
   **/
  newUserAdmin() {
    Swal.fire({
      title: '¿Registrar nuevo administrador?',
      text: "Confirma esta acción",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#e66587',
      cancelButtonColor: '#9b9b9b',
      reverseButtons: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        const controls = this.newUserAdminForm.controls;
        
        let newUser: User = new User(
          controls.names.value,
          controls.lastName.value,
          controls.secondLastName.value,
          controls.email.value,
          parseInt(controls.phoneNumber.value));

        this.userAdminService.newUserAdmin(newUser).subscribe(response => {
          this.getUserAdmins(this.actualPage);
          this.newItemRequestCancel();
          this.clear();
          this.loading = false;
          this.errorAlertService.alertSuccess('Administrador registrado correctamente.');
        }, error => {
          this.loading = false;
          this.errorAlertService.alertError(error);
        });
      }
    })
  }
  
}

