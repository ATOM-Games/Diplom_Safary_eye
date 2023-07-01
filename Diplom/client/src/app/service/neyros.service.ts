import { HttpClient } from "@angular/common/http";
import { Directive, Injectable } from "@angular/core";
import { convertToParamMap } from "@angular/router";
import { Observable, Subject, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { NeuroModuleComponent } from "../Views/neuro-module/neuro-module.component";


@Injectable({
    providedIn : 'root'
})
export class neyrosService{

    result : any;


    statuses : Map<string, number>
    

    constructor(private http : HttpClient) {
        this.statuses = new Map();

    }

    getImageWithCamera() : Observable<{data : string}> {
        return this.http.post<{data : string}>('/api/camera/get_img', {}).pipe(
            tap(
                ({data}) => {
                    this.result = JSON.parse(data);
                }
            )
        )
    }

    getGlobalRes(m : string) : Observable<{sts : string}> {
        return this.http.post<{sts:string}>('/api/neyro/getResult', {"module": m}).pipe(
            tap(
                ({sts}) => {
                    this.statuses.set(m, JSON.parse(sts));
                }
            )
        )
    }

    setSubmit(ip:string, port:string, my:string, mod : string, st:string) : Observable<{sts : string}>{
        return this.http.post<{sts:string}>('/api/neyro/submit', {"ip": ip, "port":port, myip:my, module:mod, substat:st}).pipe(
            tap(({sts}) => {})
        )
    }

    NoteSub = new Subject<Map<string, NeuroModuleComponent>>();

    //test2 : any;

    getAllModule() : Observable<{map:Map<string, NeuroModuleComponent>}> {
        return this.http.post<{map:Map<string, NeuroModuleComponent>}>('/api/neyro/getallmod', { }).pipe(
            tap(
                ({map}) => {
                    const f = new Map(Object.entries(map)) as Map<string, NeuroModuleComponent>;
                    this.NoteSub.next(f);
                }
            )
        )
    }
    

    getLocalIP() : Observable<{localIP : string}> {
        return this.http.post<{localIP:string}>('/api/neyro/getlocalip', {}).pipe(
            tap(
                ({localIP}) => {
                    console.log(localIP);
                }
            )
        )
    }

    getStatus(ip:string, port:string) : Observable<any> {
        return this.http.post<any>('/api/neyro/getStatus', {"ip": ip, "port":port});
    }

    addModule(name:string, r_name:string, ip:string, port:string, cool:number, message:string): Observable<any>{
        return this.http.post<any>('/api/neyro/addModule', {"name":name, "r_name":r_name, "ip": ip, "port":port, "cool":cool, "message":message});
    }
    editModule(name:string, r_name:string, ip:string, port:string, cool:number, message:string): Observable<any>{
        return this.http.post<any>('/api/neyro/editModule', {"name":name, "r_name":r_name, "ip": ip, "port":port, "cool":cool, "message":message});
    }
    deleteModule(name:string): Observable<any>{
        return this.http.post<any>('/api/neyro/deleteModule', {"name":name});
    }
}