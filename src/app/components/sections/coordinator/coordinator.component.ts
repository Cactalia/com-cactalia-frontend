import { Component, OnInit } from '@angular/core';
import { Token } from 'src/app/models/Token.model';
import { LoginService } from 'src/app/services/login.service';
import { CoordinatorService } from 'src/app/services/coordinator.service';
import { DegreeService } from 'src/app/services/degree.service';
import { environment } from 'src/environments/environment';
import { Coordinator } from 'src/app/models/Coordinator.model';
import  Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Degree } from 'src/app/models/Degree.model';

@Component({
  selector: 'app-coordinator',
  templateUrl: './coordinator.component.html',
  styleUrls: ['./coordinator.component.scss']
})
export class CoordinatorComponent implements OnInit {
  private tokenUser: Token;

  public newCoordinatorRequested: boolean = false;
  private loadingNewCoordinator: boolean = false;
  private coordinators: Coordinator[] = [];
  private newCoordinatorForm: FormGroup;
  private totalCoordinators:number;
  private actualPage:number;
  private degrees: Degree[];
  private maxPages:number;
  private maxDate: Date;
  private date: Date;

  constructor(
    private userFB: FormBuilder,
    private loginService: LoginService,
    private coordinatorService: CoordinatorService,
    private degreeService: DegreeService
  ) {
    this.date = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 1);
    this.actualPage=0;
    this.maxPages=1;
  }

  ngOnInit(): void {
    this.newCoordinatorForm = this.userFB.group({
      name: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      lastname: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      secondLastname: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],      
      email: ["", [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(99)]],
      grade: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ.]*"), Validators.minLength(3), Validators.maxLength(20)]],
      degree: ["", [Validators.required]],
    });

    if (localStorage.getItem(environment.authTokenKey) != null) {
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.getCoordinators(this.actualPage);
    }
  }

  /**
  * getCoordinators
  * Método que obtiene los coordinadores registrados.
  * Obtiene los coordinadores paginados
  * @param page número de pagina a obtener
  */
  getCoordinators(page:number) {
    this.coordinatorService.selectAll(page).subscribe(response => {
      this.coordinators = response.content;
      this.maxPages= response.totalPages;
      this.actualPage= page;
      this.totalCoordinators= response.totalElements;
    });
  }

  /**
   * newCoordinatorRequest
   * Método que permite la visualización del formulario de registro de coordinadores y consulta las carreras
   * registradas en la base de datos.
   */
  newCoordinatorRequest() {
    this.newCoordinatorRequested = true;
    this.getDegrees();
  }

  /**
   * newClientRequestCancel
   * Método que desaparece y reinicia el formulario de registro de coordinadores
   */
  newCoordinatorRequestCancel() {
    this.newCoordinatorRequested = false;
    this.clear();
  }

  /**
   * clear
   * Método que reinicia el formulario de registro de coordinador
   */
  clear() {
    this.newCoordinatorForm.reset();
  }

  /**
   * getDegrees
   * Método que obtiene los carreras sin coordinador
   */
  getDegrees() {
    this.degreeService.selectDegreesWithoutCoordinator().subscribe(response => {
      this.degrees = response;
    });
  }

  /**
   * newCoordinator()
   * Método que registra un nuevo coordinador
   */
  newCoordinator() {
    Swal.fire({
      title: '¿Registrar nuevo coordinador?',
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
        this.loadingNewCoordinator = true;
        const controls = this.newCoordinatorForm.controls;
        let degrees: Degree = new Degree();
        let newCoordinator: Coordinator = new Coordinator(
          null,
          controls.name.value,
          controls.lastname.value,
          controls.secondLastname.value,
          controls.email.value,
          controls.grade.value,
          "");
          degrees.id = controls.degree.value;
          newCoordinator.degree = degrees;

        this.coordinatorService.createCoordinator(newCoordinator).subscribe(response => {
          this.getCoordinators(this.actualPage);
          this.newCoordinatorRequestCancel();
          this.clear();
          this.loadingNewCoordinator = false;

          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Coordinador registrado correctamente.',
            confirmButtonColor: '#2c5234',
            cancelButtonColor: '#9b9b9b',
          });
        }, error => {
          this.loadingNewCoordinator = false;
        });
      }
    })
  }

  /**
   * deleteCoordinator
   * Método que elimina a un coordinador por su id
   * @param id id del coordinador a eliminar
   */
  deleteCoordinator(id: number) {
    Swal.fire({
      title: '¿Eliminar coordinador?',
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
        this.coordinatorService.deleteCoordinator(id).subscribe(response => {
          this.getCoordinators(this.actualPage);
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Coordinador eliminado correctamente.',
            confirmButtonColor: '#2c5234',
            cancelButtonColor: '#9b9b9b',
          })
        });
      }
    })
  }
}

