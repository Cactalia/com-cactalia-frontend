import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem(environment.authTokenKey) == null) {
      //this.router.navigateByUrl("/iniciar-sesion");
      this.router.navigateByUrl("/proximamente");
    }else{
      
    }
  }

}
