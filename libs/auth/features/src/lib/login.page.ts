import { Component, Inject, OnInit } from "@angular/core";
import { ApiService, Authenticate, User } from "../../../../core/src";
import { HttpParams } from "@angular/common/http";
import { first } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "worklog-fe-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  constructor(private router:Router,private apiService: ApiService,@Inject('apiUrlBase') public apiUrlBase: string, @Inject("apiHeaders") public apiHeaders?: any) {}

  ngOnInit() {
    if(localStorage.getItem("sessionData") != null) {
      this.router.navigate(["home"])
    }
  }

  login(auth:Authenticate){
    //this.auth.login(auth);
    //let url = this.apiUrlBase + "user/login/?profileUser=3"
    let url = "http://localhost:8000/api/user/login/?profileUser=3"
    //const params = new HttpParams().set("username", auth.username).set("password",auth.password);
    let body = {
      "email": auth.username,
      "password": auth.password
    }
    let user = this.apiService.post(url,body,this.apiHeaders).subscribe(result => {
      if(result && Object.keys(result).length != 0) {
        let param = result as User
        localStorage.setItem("sessionData",this.apiService.turnString(param))
        this.router.navigate(["home"])
      }
    })
    

    /*
    let url = "http://localhost:8000/api/user/send-email/1"
    let body = {
      "email": "starfinn99@gmail.com"
    }
    this.apiSvc.post(url,body,url_headers)
    */
  }
}
