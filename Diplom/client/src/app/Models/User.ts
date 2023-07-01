export class User {
    login : string
    password : string
    f_name : string
    s_name : string
    imageSrc? : string

    constructor(lg : string, ps : string, fn : string, sn : string, src : string) {
        this.login = lg;
        this.password = ps;
        this.f_name = fn;
        this.s_name = sn;
        this.imageSrc = src;
    }
}