import { HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, NotificationService, SharedService } from "@worklog-fe/core";
import { BehaviorSubject, Observable, lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-comments",
  templateUrl: "./comments.page.html",
  styleUrls: ["./comments.page.scss"],
})
export class CommentsPage implements OnInit {
  toolbarOptions: any;
  name: string = "";
  date: string = "";
  rows = new BehaviorSubject<Object>([]);
  rows$: Observable<any> = new Observable;
  isFct: boolean = false;
  urlBack = "students"

  orderValueList = ["first", "second", "third", "fourth", "fifth"]
  orderNameList = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"]

  constructor(private notification: NotificationService,private apiSvc: ApiService,private sharedSvc: SharedService,private menuCtrl: MenuController,private translate: TranslateService,@Inject("apiHeaders") private apiHeaders ?: any, @Inject("apiUrlBase") private apiUrlBase ?: any) {}

  async ngOnInit() {
    // toolbar options
    this.toolbarOptions = [
      {name: await lastValueFrom(this.translate.get("toolbar.profile")), value: 'profile'},
      {name: await lastValueFrom(this.translate.get("toolbar.signOut")), value: 'out'}
    ]

    // data
    let params: any = JSON.parse(this.sharedSvc.getData() as string);
    console.log(params.comments)
    
    this.name = params.name;
    this.date = params.date

    this.isFct = this.checkAgreementStatus(params.comments);

    console.log(this.isFct)
    if(!this.isFct) {
      let id = this.sharedSvc.getAuxData();
      this.chargeData(id,params.comments);
    } else {
      this.rows.next(params.comments)
      this.rows$ = this.rows.asObservable()
    }
    //this.chargeData(params.id)
  }

  checkAgreementStatus(param: Object[]) {
    let isFct = false
    param.forEach((e: any)=> {
      if(e.idModule == null) {
        isFct = true;
      }
    });
    return isFct
  }

  chargeData(id: any,comments: any) {
    let url = this.apiUrlBase + "module/get/student-modules"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    let params = new HttpParams().set("id_check", user.profile).set("id_student",id)

    this.apiSvc.get(url,params,this.apiHeaders).subscribe(
      (resolve: any) => {
        console.log(resolve)
        
        // trato el array
        let result = comments.map((obj: any, index: string | number) => Object.assign({}, obj, { name: resolve[index].name }));

        console.log(result);

        this.rows.next(result)
        this.rows$ = this.rows.asObservable()
        //this.titles.next(resolve);
        //this.titles$ = this.rows.asObservable()


      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('general.chargeErr')), "error", "medium")
      }
    )
  }


  closeMenu(param: any) {
    this.menuCtrl.close();
  }
}
