import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "../Models/User";

@Injectable({
    providedIn : 'root'
})
export class authService{
    private token : string = "";
    private currentUser : User | undefined;
    aSub? : Subscription;
    private con : boolean = true;
    constructor(private http : HttpClient) {  }
    
    login(user : User) : Observable<{token : string}> {
        return this.http.post<{token : string, us : User}>('/api/auth/login', user).pipe(
            tap(
                ({token, us}) => {
                    localStorage.setItem('authToken', token);
                    this.setToken(token);
                    this.setCurrentUser(us);
                }
            )
        )
    }
    registrate(login : string, password : string, f_name : string, s_name : string, img? : File) : Observable<{token : string}> {
        const fd = new FormData();
        fd.append('login', login);
        fd.append('password', password);
        fd.append('f_name', f_name);
        fd.append('s_name', s_name);
        if(img) {
            fd.append('image', img, img.name);
        }
        console.log(fd);
        return this.http.post<{token : string, us : User}>('/api/auth/register', fd).pipe(
            tap(
                ({token, us}) => {
                    localStorage.setItem('authToken', token);
                    this.setToken(token);
                    this.setCurrentUser(us);
                }
            )
        )
    }

    setCurrentUser(user : User) {
        this.currentUser = user as User;
    }
    setCurrentUserByToken(tkn : string) : Observable<{us : User}> {
        //console.log("<--- "+fid.get('token')+" --->");
        return this.http.post<{us : User}>('/api/auth/getByToken', {login : tkn}).pipe(
            tap(
                ({us}) => {
                    this.setCurrentUser(us);
                }
            )
        );
        //console.log(this.currentUser);
    }

    getCurrentUser() : User | null {
        //if(this.isAuthtenticated() && this.con && this.currentUser==undefined) {
        if(this.isAuthtenticated() && this.currentUser==undefined) {
            //this.con = false;
            this.setCurrentUserByToken(this.getToken()).pipe().subscribe(
                () => { console.log('success') },
                (error) => { console.warn(error) });
        }
        return (this.currentUser) ? this.currentUser : null;
    }

    setToken(token : string) {
        this.token = token
        console.log("set token -->> "+token);
    }
    getToken() : string {
        return this.token.split(' ')[1];
    }
    isAuthtenticated() : boolean {
        if(this.token!=''){
            return true;
        }else{
            return false;
        }
    }
    logout(){
        this.setToken('')
        localStorage.clear()
        this.currentUser = undefined;
    }
}