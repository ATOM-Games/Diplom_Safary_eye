import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn : 'root'
})
export class listenersService{
    constructor(private http : HttpClient) {  }

    getAllLiteners():Observable<any>{
        return this.http.post<any>('/api/listeners/getAllListeners', {});
    }

    addListener(number:string, name:string, family:string):Observable<any>{
        return this.http.post<any>('/api/listeners/addListener', {
            "number":number,
            "name":name,
            "family":family
        });
    }
    ///--------
    get_all_names_module_by_phone(number:string):Observable<any>{
        return this.http.post<any>('/api/listeners/get_all_names_module_by_phone', {
            "number":number
        });
    }

    podpiska(number:string, name:string):Observable<any>{
        return this.http.post<any>('/api/listeners/podpiska', {
            "number":number,
            "name":name
        });
    }
    otpiska(number:string, name:string):Observable<any>{
        return this.http.post<any>('/api/listeners/otpiska', {
            "number":number,
            "name":name
        });
    }

}