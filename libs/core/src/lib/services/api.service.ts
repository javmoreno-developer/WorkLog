import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/models";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private sessionData: any;

  turnObject() {
    const jsonString = localStorage.getItem("sessionData") as string;
    const userObject = JSON.parse(jsonString);
    return userObject
  }

  turnString(param: any) {
    return JSON.stringify(param);
  }


  get(url:string,params: HttpParams | null,headers: any) {
    if(params) {
      return this.http.get(url, { params,headers })
    } else {
      return this.http.get(url, { headers })
    }
   

  }

  /*post(url: string,body: any,headers: any) {
    return this.http.post(url, body,{headers}).subscribe(response => {
      console.log(response);
      return response
    });
  }*/

  post(url: string,body: any,headers: any) {
    return this.http.post(url, body,{headers})
  }

  delete(url:string,params: HttpParams,headers: any) {
    return this.http.delete(url, {params, headers })
  }

  /*put(url:string,params: HttpParams,body: any,headers: any) {
    this.http.put(url, body,{headers,params }).subscribe(response => {
      console.log(response);
    });
  }*/

  put(url:string,params: HttpParams | null,body: any,headers: any) {
    if(params) {
      return this.http.put(url, body,{params,headers })
    } else {
      return this.http.put(url, body,{headers })
    }
    
  }
}
