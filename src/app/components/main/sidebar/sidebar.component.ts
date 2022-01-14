import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from 'src/app/models/Token.model';
import { LoginService } from 'src/app/services/login.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  private tokenPayload: Token;
  menuItems: any[];

  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  /**
   * ngOnInit
   * Al iniciar el componente muestra las acciones permitidas al rol del usuario.
   */
  ngOnInit(): void {
    if (localStorage.getItem(environment.authTokenKey) != null) {
      this.tokenPayload = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.menuItems= this.loginService.setRoutesByRoles(this.tokenPayload.authorities);
    }
  }
}
