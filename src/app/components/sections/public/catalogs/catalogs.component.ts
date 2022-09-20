import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.scss']
})
export class CatalogsComponent implements OnInit {

  safeSrc: SafeResourceUrl;
  public url ="https://drive.google.com/file/d/1_TGmXak_80gdF6u0zE7Ra4ue9EOnKEV3/preview";

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) { 
    this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  ngOnInit(): void {
  }

  back(){
    this.router.navigateByUrl("/");
  }

}
