import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { DataHandlerService } from "./data-handler.service";

@Injectable({
    providedIn : 'root'
})
export class indService {
    constructor (private http: HttpClient,
        private dataHandler : DataHandlerService) {  }

    fillPagesOfChapt(id : string) : Observable<string[]> {
        return this.http.get<string[]>('/api/page/all', {params : { chapter : id }}).pipe(
            
        )
    }
}