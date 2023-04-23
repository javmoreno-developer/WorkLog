import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get(url:string,params: HttpParams,headers: any) {
    this.http.get(url, { params,headers }).subscribe((data) => {
      console.log(data);
    });

  }

  post(url: string,body: any,headers: any) {
    this.http.post(url, body,{headers}).subscribe(response => {
      console.log(response);
    });
  }

  delete(url:string,params: HttpParams,headers: any) {
    this.http.delete(url, {params, headers }).subscribe(response => {
      console.log(response);
    });
  }

  put(url:string,params: HttpParams,body: any,headers: any) {
    this.http.put(url, body,{headers,params }).subscribe(response => {
      console.log(response);
    });
  }
}
