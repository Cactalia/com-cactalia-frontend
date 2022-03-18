import { Component, OnInit } from '@angular/core';
import { Token } from 'src/app/models/Token.model';
import { LoginService } from 'src/app/services/login.service';
import { UserClientService } from 'src/app/services/userClient.service';
import { AlertService } from 'src/app/utils/alert.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/User.model';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  private tokenUser: Token;

  clients: User[] = [];
  totalElements:number;
  actualPage:number;
  maxPages:number;

  constructor(
    private loginService: LoginService,
    private userClientService: UserClientService,
    private errorAlertService: AlertService,
  ) {
    this.actualPage=0;
    this.maxPages=1;
  }

  ngOnInit(): void {
    if (localStorage.getItem(environment.authTokenKey) != null) {
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.getUserClients(this.actualPage);
    }
  }

  /**
  * getUserClients
  * Método que obtiene los clientes registrados.
  * Obtiene los clientes paginados
  * @param page número de pagina a obtener
  */
   getUserClients(page:number) {
    this.userClientService.selectAll(page,5).subscribe(response => {
      this.clients = response.page.content;
      this.maxPages= response.page.totalPages;
      this.actualPage= page;
      this.totalElements= response.page.totalElements;
    }, error => {
      this.errorAlertService.alertError(error);
    });
  }

}
