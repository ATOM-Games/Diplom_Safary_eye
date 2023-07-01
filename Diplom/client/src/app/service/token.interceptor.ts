import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { authService } from "./auth-service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    
    constructor(private auth : authService) {  }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(this.auth.isAuthtenticated()){
            req = req.clone({
                setHeaders : {
                    Authorization : this.auth.getToken()
                }
            })
        }
        return next.handle(req)
    }

}