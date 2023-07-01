import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, interval } from 'rxjs';
import { neyrosService } from 'src/app/service/neyros.service';
import { NeuroModuleComponent } from 'src/app/Views/neuro-module/neuro-module.component';
import { AdminPanelListenersComponent } from '../admin_panel_listeners/admin_panel_listeners.component';

@Component({
  selector: 'app-neyros',
  templateUrl: './neyros.component.html',
  styleUrls: ['./neyros.component.less']
})
export class NeyrosComponent implements OnInit, OnDestroy {

  @Input() _SHOW_AD_PANEL : boolean = false;
  @Output() onClosePanel = new EventEmitter()

  onClosePanelVoid(event:any):void{
    if(event === 'onClosePanel'){
      this.onClosePanel.emit('onClosePanel');
    }
  }

  src_img : string = "";
  method : any;
  SUMM : number = 0;


  mod = new Map<string, NeuroModuleComponent>();
  mod_res = new Map<string, number>();

  vizyvatel : any = null;
  
  PopupForm!: FormGroup;

  constructor(private ney_serv : neyrosService) {}

  
  ngOnInit() : void {
    this.ney_serv.NoteSub.subscribe(map=>{
      this.mod.clear();
      this.mod = map;
      
     });
    this.ney_serv.getAllModule().subscribe(() => {});

    this.ney_serv.getLocalIP().subscribe(({localIP})=>{
      this.my_ip_pt = localIP;
    });
    this.PopupForm = new FormGroup({
      PoPuP_NaMe : new FormControl(null, [Validators.required]),
      PoPuP_RNaMe : new FormControl(null, [Validators.required]),
      PoPuP_Ip : new FormControl(null, [Validators.required]),
      PoPuP_PoRt : new FormControl(null, [Validators.required]),
      PoPuP_Cool : new FormControl(null, [Validators.required]),
      PoPuP_Mess : new FormControl(null, [Validators.required]),
    });
  }

  _GLOBAL_update_list_of_modules() : void {
    this.mod.clear();
    this.mod = new Map<string, NeuroModuleComponent>();
    this.ney_serv.getAllModule().subscribe(() => {});

  }

  getImage(){      
      const t = this.ney_serv.getImageWithCamera().subscribe(
        ()=>{
          this.src_img = "data:image/png;base64,"+this.ney_serv.result.data.b64_frame;
          this.getImage();
      } );
  }
  
  countSumm():void{
    console.log("summ "+this.SUMM);
    let summ = 0;
    if(this.mod.size>0){
      for ( let v of this.mod){
        summ = summ + v[1].result;
      }
    }
    this.SUMM = summ;
  }

  isWarning():boolean{
    this.SUMM = 0;
    for(let e of this.mod_res){
      this.SUMM = this.SUMM + e[1];
    }
    return (this.SUMM>0);
  }

  getClass():string{
    if(this.isRed()) return "light_red";
    if(this.isGreen()) return "light_green";
    return "light_gray";
  }

  isRed():boolean{
    let b = false;
    for(let e of this.mod_res){
      if(e[1] == 1){
        b =true; break;
      }
    }
    return b;
  }
  isGreen():boolean{
    let b = false;
    for(let e of this.mod_res){
      if(e[1] == 0){
        b =true; break;
      }
    }
    return b;
  }

  ngOnDestroy(){
    if (this.method) {
      clearInterval(this.method);
    }
  }
  module_name : string="";
  module_ip : string="";
  module_port : number=0;
  //
  my_ip_pt = '10.0.0.10';

  addModule() : void{
    if(this.mod.has(this.module_name)){

    }else{
      this.mod.set(this.module_name, new NeuroModuleComponent(this, this.ney_serv));
      this.mod_res.set(this.module_name,-1);
    }
  }
  ///=================================================
  // add
  add_popup : boolean = false;

  popup_name:string = '';
  popup_ip:string = '';
  popup_port:number = 0;


  add_popup_function():void{
    this.add_popup = true;
  }


  cancel_popup_function():void{
    this.add_popup = false;
  }
  ok_popup_function():void{
    let _valid = true;
    if(this.PopupForm.invalid){
      if(!this.PopupForm.controls['PoPuP_NaMe'].valid){
        _valid = false;
        document.getElementById('l_name')?.setAttribute('class','label red');
        document.getElementById('i_name')?.setAttribute('class','input red');
      }
      if(!this.PopupForm.controls['PoPuP_RNaMe'].valid){
        _valid = false;
        document.getElementById('l_rname')?.setAttribute('class','label red');
        document.getElementById('i_rname')?.setAttribute('class','input red');
      }
      if(!this.PopupForm.controls['PoPuP_Ip'].valid){
        _valid = false;
        document.getElementById('l_ip')?.setAttribute('class','label red');
        document.getElementById('i_ip')?.setAttribute('class','input red');
      } 
      if(!this.PopupForm.controls['PoPuP_PoRt'].valid){
        _valid = false;
        document.getElementById('l_port')?.setAttribute('class','label red');
        document.getElementById('i_port')?.setAttribute('class','input red');
      } 
      if(!this.PopupForm.controls['PoPuP_Cool'].valid){
        _valid = false;
        document.getElementById('l_cool')?.setAttribute('class','label red');
        document.getElementById('i_cool')?.setAttribute('class','input red');
      } 
      if(!this.PopupForm.controls['PoPuP_Mess'].valid){
        _valid = false;
        document.getElementById('l_mess')?.setAttribute('class','label red');
        document.getElementById('i_mess')?.setAttribute('class','input red');
      } 

    } else {
      if(this.mod.get(this.PopupForm.value.PoPuP_NaMe)!=undefined){
        _valid = false;
        document.getElementById('l_name')?.setAttribute('class','label red');
        document.getElementById('i_name')?.setAttribute('class','input red');
      }
      
      if(_valid) {
        this.ney_serv.addModule(
          this.PopupForm.value.PoPuP_NaMe,
          this.PopupForm.value.PoPuP_RNaMe,
          this.PopupForm.value.PoPuP_Ip,
          this.PopupForm.value.PoPuP_PoRt.toString(),
          this.PopupForm.value.PoPuP_Cool,
          this.PopupForm.value.PoPuP_Mess
        ).pipe().subscribe(res=> {
          this.ney_serv.getAllModule().subscribe(() => {});
          this.add_popup = false;
        }, err=> {
          console.log('inici onalo liziroval oshibku');
          console.log(err);
        })
      }
    }      
  }
}
