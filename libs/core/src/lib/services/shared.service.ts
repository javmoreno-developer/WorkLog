import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/models";

@Injectable({
  providedIn: "root",
})
export class SharedService {

  getData() {
    return localStorage.getItem("sharedData")
  }
  setData(n: any) {
    console.log(n);
    localStorage.setItem("sharedData",JSON.stringify(n))
  }
}
