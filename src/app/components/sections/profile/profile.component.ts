import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Token } from 'src/app/models/Token.model';
import { User } from 'src/app/models/User.model';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  tokenUser: Token;
  private myControl: FormControl = new FormControl();
  loadingUpdate: boolean = false;
  profileForm: FormGroup;
  user: User = new User(null, "", "", "", "", "", "");
  maxDate: Date;

  constructor(
    private userFB: FormBuilder,
    private loginService: LoginService,
    private userService: UserService) {
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 1);
  }

  ngOnInit(): void {
    this.profileForm = this.userFB.group({
      email: ["", [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(99)]],
      grade: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ.]*"), Validators.minLength(3), Validators.maxLength(20)]],
      password: ["", [Validators.minLength(6), Validators.maxLength(14)]],
      name: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      lastname: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      secondLastname: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]]
    });
    if (localStorage.getItem(environment.authTokenKey) != null) {
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.getAndShowDataUser();
    }
  }

  /**
   * getAndShowDataUser
   * Método que obtiene y muestra la información del usuario
   */
  getAndShowDataUser() {
    const controls = this.profileForm.controls;
    this.userService.findUserById(this.tokenUser.id, this.tokenUser.authorities[0]).subscribe(response => {
      this.user = response;
      controls.email.setValue(this.user.email);
      controls.grade.setValue(this.user.grade);
      controls.name.setValue(this.user.name);
      controls.lastname.setValue(this.user.lastname);
      controls.secondLastname.setValue(this.user.secondLastname);
      //controls.password.setValue(this.user.password);
    });
  }

  /**
   * updateProfile
   * Método que actualiza la información del usuario
   */
  updateProfile() {
    if (this.profileForm.valid) {
      Swal.fire({
        title: '¿Actualizar perfil?',
        text: "Confirma esta acción.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#55919e',
        cancelButtonColor: '#9b9b9b',
        reverseButtons: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Actualizar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingUpdate = true;
          const controls = this.profileForm.controls;
          let userUpdate: User = new User(
            this.user.id,
            controls.name.value,
            controls.lastname.value,
            controls.secondLastname.value,
            controls.email.value,
            controls.grade.value,
            controls.password.value);
          this.userService.alterUser(userUpdate).subscribe(response => {
            this.loadingUpdate = false;
            this.user = response;
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'Perfil actualizado correctamente.',
              confirmButtonColor: '#55919e',
              cancelButtonColor: '#9b9b9b',
            })
          }, error => {
            this.loadingUpdate = false;
          });
        }
      })
    }
  }
}
