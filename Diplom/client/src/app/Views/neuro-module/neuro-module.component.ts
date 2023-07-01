import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { neyrosService } from 'src/app/service/neyros.service';
import { NeyrosComponent } from '../neyros/neyros.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-neuro-module',
  templateUrl: './neuro-module.component.html',
  styleUrls: ['./neuro-module.component.less']
})
export class NeuroModuleComponent implements OnInit, OnChanges {

  @Input() data : any;
  name: string="";
  r_name: string="";
  ip : string="";
  port : number=0;
  cool : number=0;
  mess : string="";

  my_ip : string='10.0.0.195';

  status : string = "off";
  _status : string = "off";
  result : any=-1;
  res : any={};
  editing : boolean= false;
  tracking? : any;
  
  EditPopupForm!: FormGroup;

  constructor(private neyro: NeyrosComponent, private ney_serv : neyrosService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['data'].currentValue){
      this.name = changes['data'].currentValue.value.name;
      this.r_name = changes['data'].currentValue.value.r_name;
      this.ip = changes['data'].currentValue.value.ip;
      this.port = changes['data'].currentValue.value.port;
      this.cool = changes['data'].currentValue.value.cool_daun;
      this.mess = changes['data'].currentValue.value.att_message;
    }
  }

  ngOnInit(): void {
    this.onlinepdate();
  }

  wait_5_sek(){
    this.tracking = setInterval(() => {
      this.onlinepdate();
    }, 5000);
  }

  onlinepdate(): void{
    clearInterval(this.tracking);
    this.tracking = null;
    this.ney_serv.getStatus(this.ip, this.port.toString()).pipe().subscribe((res)=>{
      console.log('statusyandr')
      console.log(res)
      this._status = res.result;
      this.wait_5_sek();
    });
  }

  

  getStatus( ) : number {
    if(this._status==='offline')
      return 0;
    if(this._status==='online')
      return 1;
    return -1;
  }


  submit():void{
    this.ney_serv.setSubmit(this.ip, this.port.toString(), this.my_ip, this.name, this.getTextButton()).subscribe(
      ()=>{}
    );
    this.getRes();
  }

  getRes() {
    if(this._status === 'online'){
      const t = this.ney_serv.getGlobalRes(this.name).subscribe(
        ()=>{
        this.result = this.ney_serv.statuses.get(this.name);
        this.neyro.mod_res.set(this.name, this.result);
        if(this.ney_serv.statuses.get(this.name)!=-1) {
          this.getRes();
        }
    } );
    }else{
      this.result = -1;
        this.neyro.mod_res.set(this.name, this.result);
    }


    
  }

  getClass():string{
    if(this.result === -1){
      return "light_gray";
    }else{
      return (this.result!=0)?"light_red":"light_green";
    }
  }

  getTextButton():string{
    return(this.result===-1) ? 'подписаться' : 'отписаться';
  }

///=================================================
  // add
  edit_popup : boolean = false;
  delete_popup: boolean = false;

  popup_name:string = '';
  popup_ip:string = '';
  popup_port:number = 0;


  edit_popup_function():void{
    this.EditPopupForm = new FormGroup({
      PoPuP_NaMe : new FormControl(this.name, [Validators.required]),
      PoPuP_RNaMe : new FormControl(this.r_name, [Validators.required]),
      PoPuP_Ip : new FormControl(this.ip, [Validators.required]),
      PoPuP_PoRt : new FormControl(this.port, [Validators.required]),
      PoPuP_Cool : new FormControl(this.cool, [Validators.required]),
      PoPuP_Mess : new FormControl(this.mess, [Validators.required])
    });
    this.edit_popup = true;
  }


  cancel_popup_function():void{
    this.EditPopupForm.reset();
    this.edit_popup = false;
  }
  ok_popup_function():void{
    let _valid = true;
    if(this.EditPopupForm.invalid){
      if(!this.EditPopupForm.controls['PoPuP_NaMe'].valid){
        _valid = false;
        document.getElementById('l_name')?.setAttribute('class','label red');
        document.getElementById('i_name')?.setAttribute('class','input red');
      }
      if(!this.EditPopupForm.controls['PoPuP_RNaMe'].valid){
        _valid = false;
        document.getElementById('l_rname')?.setAttribute('class','label red');
        document.getElementById('i_rname')?.setAttribute('class','input red');
      }
      if(!this.EditPopupForm.controls['PoPuP_Ip'].valid){
        _valid = false;
        document.getElementById('l_ip')?.setAttribute('class','label red');
        document.getElementById('i_ip')?.setAttribute('class','input red');
      } 
      if(!this.EditPopupForm.controls['PoPuP_PoRt'].valid){
        _valid = false;
        document.getElementById('l_port')?.setAttribute('class','label red');
        document.getElementById('i_port')?.setAttribute('class','input red');
      } 
      if(!this.EditPopupForm.controls['PoPuP_Cool'].valid){
        _valid = false;
        document.getElementById('l_cool')?.setAttribute('class','label red');
        document.getElementById('i_cool')?.setAttribute('class','input red');
      } 
      if(!this.EditPopupForm.controls['PoPuP_Mess'].valid){
        _valid = false;
        document.getElementById('l_mess')?.setAttribute('class','label red');
        document.getElementById('i_mess')?.setAttribute('class','input red');
      } 

    } else {
      if(_valid) {
        this.ney_serv.editModule(
          this.EditPopupForm.value.PoPuP_NaMe,
          this.EditPopupForm.value.PoPuP_RNaMe,
          this.EditPopupForm.value.PoPuP_Ip,
          this.EditPopupForm.value.PoPuP_PoRt.toString(),
          this.EditPopupForm.value.PoPuP_Cool,
          this.EditPopupForm.value.PoPuP_Mess,
        ).pipe().subscribe(res=> {
          this.ney_serv.getAllModule().subscribe(() => {});
          this.EditPopupForm.reset();
          this.edit_popup = false;
        }, err=> {
          console.log('inici onalo liziroval oshibku');
          console.log(err);
        })
      }
    }      
  }
////////////////
  delete_popup_function() : void {
    this.delete_popup = true;
  }
  canceld_popup_function() : void {
    this.delete_popup = false;
  }
  deleteOk_popup_function():void{
    this.ney_serv.deleteModule(this.name).pipe().subscribe(
      res=>{
        this.ney_serv.getAllModule().subscribe(() => {});
        this.delete_popup = false;
      }, err=> {
        console.log('inici onalo liziroval oshibku');
        console.log(err);
      }
    )
  }


}
