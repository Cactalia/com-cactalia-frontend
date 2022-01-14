import { Component, OnInit } from '@angular/core';
import { Token } from 'src/app/models/Token.model';
import { LoginService } from 'src/app/services/login.service';
import { ProfessorService } from 'src/app/services/professor.service';
import { environment } from 'src/environments/environment';
import { Professor } from 'src/app/models/Professor.model';
import  Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-professor-coordinator',
  templateUrl: './professor-coordinator.component.html',
  styleUrls: ['./professor-coordinator.component.scss']
})
export class ProfessorCoordinatorComponent implements OnInit {
  private tokenUser: Token;

  public newProfessorRequested: boolean = false;
  private loadingNewProfessor: boolean = false;
  private professors: Professor[] = [];
  private newProfessorForm: FormGroup;
  private totalProfessors:number;
  private actualPage:number;
  private maxPages:number;
  private maxDate: Date;
  private date: Date;

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
      email: ["", [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(99)]],
    });

    if (localStorage.getItem(environment.authTokenKey) != null) {
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.getProfessors(this.actualPage);
    }
  }

  /**
  * getProfessors
  * Método que obtiene los profesores de la carrera asociada al coordinador.
  * Obtiene los profesores paginados
  * @param page número de página a obtener
  * @param idCoordinator id del coordinador
  */
  getProfessors(page:number) {
    this.professorService.selectProfessorByDegree(page, this.tokenUser.id).subscribe(response => {
      this.professors = response.content;
      this.maxPages= response.totalPages;
      this.actualPage= page;
      this.totalProfessors= response.totalElements;
    });
  }

  /**
   * newProfessorRequest
   * Método que permite la visualización del formulario de registro de profesor
   */
  newProfessorRequest() {
    this.newProfessorRequested = true;
  }

  /**
   * newProfessorRequestCancel
   * Método que desaparece y reinicia el formulario de registro del profesor
   */
  newProfessorRequestCancel() {
    this.newProfessorRequested = false;
    this.clear();
  }

  /**
   * clear
   * Método que reinicia el formulario de registro de profesor
   */
  clear() {
    this.newProfessorForm.reset();
  }

  /**
   * newProfessor()
   * Método que agrega un profesor a la carrera
   */
  newProfessor() {
    Swal.fire({
      title: '¿Agregar nuevo profesor?',
      text: "Confirma esta acción",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2c5234',
      cancelButtonColor: '#9b9b9b',
      reverseButtons: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingNewProfessor = true;
        const controls = this.newProfessorForm.controls;
        this.professorService.addProfessor(controls.email.value, this.tokenUser.id).subscribe(response => {
          this.getProfessors(this.actualPage);
          this.newProfessorRequestCancel();
          this.clear();
          this.loadingNewProfessor = false;

          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Profesor agregado correctamente.',
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
   * deleteAssign
   * Método que elimina la asignación de carrera de un profesor por su id y id del coordinador
   * @param idProfessor id del profesor
   * @param idCoordinator id del coordinador
   */
   deleteAssign(idProfessor: number, idCoordinator: number) {
    Swal.fire({
      title: '¿Eliminar asignación?',
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
        this.professorService.deleteAssign(idProfessor, idCoordinator).subscribe(response => {
          this.getProfessors(this.actualPage);
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Asignación eliminada correctamente.',
            confirmButtonColor: '#2c5234',
            cancelButtonColor: '#9b9b9b',
          })
        });
      }
    })
  }
}

