import { Component, OnInit } from '@angular/core';
import { Token } from 'src/app/models/Token.model';
import { LoginService } from 'src/app/services/login.service';
import { ProfessorService } from 'src/app/services/professor.service';
import { environment } from 'src/environments/environment';
import { Professor } from 'src/app/models/Professor.model';
import  Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-professor-administrator',
  templateUrl: './professor-administrator.component.html',
  styleUrls: ['./professor-administrator.component.scss']
})
export class ProfessorAdministratorComponent implements OnInit {
  private tokenUser: Token;

  private professors: Professor[] = [];
  private newProfessorForm: FormGroup;
  public newProfessorRequested: boolean = false;
  private loadingNewProfessor: boolean = false;
  private date: Date;
  private maxDate: Date;
  private actualPage:number;
  private maxPages:number;
  private totalProfessors:number;

  constructor(
    private userFB: FormBuilder,
    private loginService: LoginService,
    private professorService: ProfessorService,
  ) {
    this.date = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 1);
    this.actualPage=0;
    this.maxPages=1;
  }

  ngOnInit(): void {
    this.newProfessorForm = this.userFB.group({
      name: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      lastname: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      secondLastname: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      email: ["", [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(99)]],
      grade: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ.]*"), Validators.minLength(3), Validators.maxLength(20)]]
    });

    if (localStorage.getItem(environment.authTokenKey) != null) {
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.getProfessors(this.actualPage);
    }
  }

  /**
  * getProfessors
  * Método que obtiene los profesores registrados.
  * Obtiene los profesores paginados
  * @param page número de página a obtener
  */
  getProfessors(page:number) {
    this.professorService.selectAll(page).subscribe(response => {
      this.professors = response.content;
      this.maxPages= response.totalPages;
      this.actualPage= page;
      this.totalProfessors= response.totalElements;
    });
  }

  /**
   * newProfessorRequest
   * Método que permite la visualización del formulario de registro de profesores
   */
  newProfessorRequest() {
    this.newProfessorRequested = true;
  }

  /**
   * newProfessorRequestCancel
   * Método que desaparece y reinicia el formulario de registro del profesores
   */
  newProfessorRequestCancel() {
    this.newProfessorRequested = false;
    this.clear();
  }

  /**
   * clear
   * Método que reinicia el formulario de registro de profesores
   */
  clear() {
    this.newProfessorForm.reset();
  }

  /**
   * newProfessor()
   * Método que registra un nuevo profesor
   */
  newProfessor() {
    Swal.fire({
      title: '¿Registrar nuevo profesor?',
      text: "Confirma esta acción",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2c5234',
      cancelButtonColor: '#9b9b9b',
      reverseButtons: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingNewProfessor = true;
        const controls = this.newProfessorForm.controls;
        let newProfessor: Professor = new Professor(
          null,
          controls.name.value,
          controls.lastname.value,
          controls.secondLastname.value,
          controls.email.value,
          controls.grade.value,
          "");

        this.professorService.createProfessor(newProfessor).subscribe(response => {
          this.getProfessors(this.actualPage);
          this.newProfessorRequestCancel();
          this.clear();
          this.loadingNewProfessor = false;

          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Profesor registrado correctamente.',
            confirmButtonColor: '#2c5234',
            cancelButtonColor: '#9b9b9b',
          });
        }, error => {
          this.loadingNewProfessor = false;
        });
      }
    })
  }

  /**
   * deleteClient
   * Método que elimina a un profesor por su id
   * @param id id del profesor a eliminar
   */
  deleteProfessor(id: number) {
    Swal.fire({
      title: '¿Eliminar profesor?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2c5234',
      cancelButtonColor: '#9b9b9b',
      reverseButtons: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.professorService.deleteProfessor(id).subscribe(response => {
          this.getProfessors(this.actualPage);
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Profesor eliminado correctamente.',
            confirmButtonColor: '#2c5234',
            cancelButtonColor: '#9b9b9b',
          })
        });
      }
    })
  }
}

