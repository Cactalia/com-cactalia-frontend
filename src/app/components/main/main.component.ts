import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginService } from '../../services/login.service';
import { NgxRolesService } from 'ngx-permissions';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private router: Router,
    private loginService: LoginService,
    private rolesService: NgxRolesService
  ) { }

  /**
   * ngOnInit
   * Al iniciar el componente valida que exista un token almacenado, de lo contrario redirige 
   * al inicio de sesión
   */
  ngOnInit(): void {
    if (localStorage.getItem(environment.authTokenKey) == null) {
      this.router.navigateByUrl("/iniciar-sesion");
    }else{
      let token = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      
      if (token.exp < Date.now() / 1000) {
        localStorage.removeItem(environment.authTokenKey);
        this.router.navigateByUrl("/iniciar-sesion");
      }else{
        token.authorities.forEach(role => {
          this.rolesService.addRole(role, []);              
        });
      }
    }
  }

}
