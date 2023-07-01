import { HttpContext } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { authService } from 'src/app/service/auth-service';
import { DataHandlerService } from 'src/app/service/data-handler.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class userComponent implements OnInit, OnDestroy {
  @ViewChild('inputFile')
  iF? : ElementRef;

  login_form!: FormGroup;
  regis_form!: FormGroup;
  img?: File;
  aSub? : Subscription;
  //
  login : boolean = true;
  errorText : String = "";

  constructor(
    private dataHandler:DataHandlerService,
    private auth : authService
    ) {  }

  ngOnInit(): void {
    
    this.login_form = new FormGroup({
      login : new FormControl(null, [Validators.required]),
      password : new FormControl(null, [Validators.required])
    });

    this.regis_form = new FormGroup({
      login : new FormControl(null, [Validators.required]),
      password : new FormControl(null, [Validators.required]),
      f_name : new FormControl(null, [Validators.required]),
      s_name : new FormControl(null, [Validators.required]),
      imageSrc : new FormControl(null)
    })
  }
  ngOnDestroy() : void {
    if(this.aSub) { this.aSub.unsubscribe() }
  }
  //---login
  onLogin() : void {
    this.login_form.disable();
    this.aSub = this.auth.login(this.login_form.value).pipe().subscribe(
      () => { 
        console.log('success');
        this.auth.getCurrentUser();
      },
      (error) => { 
        console.warn(error);
        this.login_form.enable();
        if(error.status == 404 || error.status == 401){
          this.errorText = error.error.message+"";
        }
      }
    )
  }
  //---registrate
  onRegis() : void {
    this.regis_form.disable(this.regis_form.value);
    console.log(this.regis_form.value);
    this.aSub = this.auth.registrate(this.regis_form.value.login,
      this.regis_form.value.password,
      this.regis_form.value.f_name,
      this.regis_form.value.s_name,
       this.img).subscribe(
      () => { 
        console.log('success')
      },
      (error) => { 
        console.warn(error)
        this.regis_form.enable()
        if(error.status == 404 || error.status == 401 || error.status == 409){
          this.errorText = error.error.message+"";
        }
      }
    )
  }
  uploadFile(event: any) : void {
    this.img = event.target.files[0];
  }
  inputFileClick(){ this.iF?.nativeElement.click(); }

}
