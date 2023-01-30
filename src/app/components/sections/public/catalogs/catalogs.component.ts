import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.scss']
})
export class CatalogsComponent implements OnInit {

  public menuExpanded:boolean = true;
  safeSrc: SafeResourceUrl;
  public url = "";

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
  }

  back(){
    this.router.navigateByUrl("/");
  }

  changeMenuExpanded(){
    this.menuExpanded = !this.menuExpanded;
  }

  changePdfFile(url:string){
    this.url = url;
    this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

}
