import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from 'src/app/models/Token.model';
import { User } from 'src/app/models/User.model';
import { LoginService } from 'src/app/services/login.service';
import { UserClientService } from 'src/app/services/userClient.service';
import { AlertService } from 'src/app/utils/alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit {

  tokenUser: Token;
  userId: string ="efcbd75c-019c-4a39-b5ef-26386c6bc10f";
  user: User = new User("", "", "", "", 0);
  
  constructor(
    private router: Router,
    private loginService: LoginService,
    private userService: UserClientService,
    private errorAlertService: AlertService) {
  }

  ngOnInit(): void {
    if (localStorage.getItem(environment.authTokenKey) == null) {
      this.router.navigateByUrl("/iniciar-sesion");
    }else{
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.getAndShowDataUser();
    }
  }

  /**
   * getAndShowDataUser
   * Método que obtiene y muestra la información del usuario
   */
  getAndShowDataUser() {
    this.userService.findById(this.userId).subscribe(response => {
      this.user = response;
    }, error => {
      this.errorAlertService.alertError(error);
    });
  }

}
