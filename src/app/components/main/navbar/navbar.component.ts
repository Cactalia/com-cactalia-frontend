import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
     * logout
     * Método ejecutado al presionar el botón "Cerrar sesión"
     */
    logout() {
      localStorage.removeItem(environment.authTokenKey);
      this.router.navigateByUrl("/iniciar-sesion");
  }

}