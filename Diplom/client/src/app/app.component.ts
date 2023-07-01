import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { authService } from './service/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';

  _SHOW_AD_PANEL:boolean = false;
  openPanelAd():void{this._SHOW_AD_PANEL=true;}
  close(event:any){
    if(event === 'onClosePanel'){
      this._SHOW_AD_PANEL = false;
    }
  }

  constructor(private auth : authService) {  }
  ngOnInit(): void {
    const ct = localStorage.getItem('authToken');
    if (ct != '' && ct != null) {
      this.auth.setToken( ct );
    }
  }
  
  isAuth() : boolean { return this.auth.isAuthtenticated() }
  logout() { this.auth.logout() }

  getUserName() : string {
    return (this.auth.getCurrentUser()?.f_name+" "+this.auth.getCurrentUser()?.s_name);
  }
  getSrcIco() : string {
    return (this.auth.getCurrentUser()?.imageSrc)? this.auth.getCurrentUser()?.imageSrc+"" : "uploads/RedKrest.png";
  }


}
