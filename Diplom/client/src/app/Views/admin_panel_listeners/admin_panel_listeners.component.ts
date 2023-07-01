import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { listenersService } from 'src/app/service/listeners.service';

@Component({
  selector: 'apl',
  templateUrl: './admin_panel_listeners.component.html',
  styleUrls: ['./admin_panel_listeners.component.less']
})
export class AdminPanelListenersComponent implements OnInit {

  @Input() _SHOW_AD_PANEL : boolean = false;
  @Output() onClosePanel = new EventEmitter()
  close():void{this.onClosePanel.emit('onClosePanel');}

  listeners = new Map<string, {number:string, name:string, family:string}>();
  constructor(private listnr : listenersService) { }

  ngOnInit(): void {
    this.getAllListeners();
  }

  getAllListeners(){
    this.listnr.getAllLiteners().pipe().subscribe(
      res => {
        this.listeners = new Map(Object.entries(res.map)) as Map<string, {number:string, name:string, family:string}>
    })
  }

  getNumber(number:string, show:boolean) : string {
    if(show) {
      let str = "";
      if(number!='null' && number.length>0) {
        str = "+";
        for(let i=0; i< number.length && i<11; i++){
          if(i==1 || i==4 || i==7 || i==9){ str+=" "; }
          str+= number[i];
        }
      }
      return str;
    } else {
      if(number.length != 11){
        return "<i>некорректный номер</i>";
      } else {
        return "+"+number[0]+" "+number[1]+number[2]+number[3]+" "+number[4]+number[5]+number[6]+" "+number[7]+number[8]+" "+number[9]+number[10]
      }
    }
  }
  // - add 
  
  _add_listener : boolean = false;
  _add_listener_PopupForm!: FormGroup;

  number_phone : number = -1;

  click_add_listener() : void{
    this._add_listener_PopupForm = new FormGroup({
      _a_l_number : new FormControl(null, [Validators.required, Validators.pattern('[0-9]{11,14}')]),
      _a_l_name : new FormControl(null, [Validators.required]),
      _a_l_family : new FormControl(null, [Validators.required]),
    });
    this._add_listener=true;
  }
  _error_text : string = "";
  ok_popup_add_listener() : void{
    let _valid = true;
    if(this._add_listener_PopupForm.invalid){
      if(!this._add_listener_PopupForm.controls['_a_l_number'].valid){
        _valid = false;
        document.getElementById('l_number')?.setAttribute('class','label red');
        document.getElementById('i_number')?.setAttribute('class','input red');
      }
      if(!this._add_listener_PopupForm.controls['_a_l_name'].valid){
        _valid = false;
        document.getElementById('l_name')?.setAttribute('class','label red');
        document.getElementById('i_name')?.setAttribute('class','input red');
      }
      if(!this._add_listener_PopupForm.controls['_a_l_family'].valid){
        _valid = false;
        document.getElementById('l_family')?.setAttribute('class','label red');
        document.getElementById('i_family')?.setAttribute('class','input red');
      }
    }else{
      let new_number = -1;
      try{
        new_number = 0;
        for(let i=0; i<11; i++){
          new_number = (new_number*10 + Number.parseInt(this._add_listener_PopupForm.value._a_l_number.toString()[i]));
        }
      }catch(e){
        _valid = false;
        document.getElementById('l_number')?.setAttribute('class','label red');
        document.getElementById('i_number')?.setAttribute('class','input red');
      }
      if(_valid){
        this.listnr.addListener(
          new_number.toString(),
          this._add_listener_PopupForm.value._a_l_name,
          this._add_listener_PopupForm.value._a_l_family
        ).pipe().subscribe(
          ()=>{
            this.getAllListeners();
            this._error_text="";
            this._add_listener=false;
          },
          (error) => {
            console.log('eeeeerrrrrrrr');
            console.log(error);
            this._error_text = error.error.error;
          }
        );
      }
    }
  }
  cancel_popup_add_listener() : void{
    this._error_text="";
    this._add_listener=false;
  }

  getNumber2():string{
    return this.getNumber(this._add_listener_PopupForm.value._a_l_number+"", true);
  }
  // - select
  
  selected_listener : string = "";
  buttons_subs : {id:string,name:string,subs:boolean}[] = [];

  click_select_listener(num:string):void{
    this.selected_listener = num;
    console.log('SELECTED');  
    console.log(this.listeners.get(this.selected_listener));
    this.getButton();
  }

  getButton():void{
    this.buttons_subs = [];
    this.listnr.get_all_names_module_by_phone(this.selected_listener).pipe().subscribe(res=>{
      this.buttons_subs = res.result
    });
  }

  close_select_listener():void{
    this.selected_listener = "";
  }
  getObject():any{
    return this.listeners.get(this.selected_listener);
  }
  buttons_subs_getclass(s:boolean):string{
    return s ? "subs" : "dontsuns";
  }
  buttons_subs_gettext(s:boolean):string{
    return s ? "подписан" : "подписаться";
  }

  buttons_subs_click(id:string, number:string, s:boolean):void{
    if(s){ // otpiska
      this.listnr.otpiska(number,id).pipe().subscribe(
        res=>{
          console.log(res);
          this.getButton();
        },
        (error)=>{console.log('error');});
    }else{ // podpiska
      this.listnr.podpiska(number,id).pipe().subscribe(
        res=>{
          console.log(res);
          this.getButton();
        },
        (error)=>{console.log('error');});
    }
  }


}