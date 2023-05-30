import { HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, MenuController, PopoverController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, NotificationService, SharedService } from "@worklog-fe/core";
import { BehaviorSubject, lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-entries",
  templateUrl: "./entries.page.html",
  styleUrls: ["./entries.page.scss"],
})
export class EntriesPage implements OnInit {
  toolbarOptions: any;
  rows = new BehaviorSubject<Object>([]);
  columns = new BehaviorSubject<Object>([]);
  comments = new BehaviorSubject<Object>([]);
  tableStyle = "inform"
  name = ""
  urlBack = "students"

  tableButtons = [
    {icon: "eye", text: "Comentarios", fun: "onSubRoute", cssClass: "see_entries_btn", popover: false, route: "student/entry/comment"},
  ]

  constructor(private notification: NotificationService,private sharedSvc: SharedService,private router: Router,private popOver: PopoverController,private translate: TranslateService,private alert:AlertController,private apiSvc: ApiService,private menuCtrl: MenuController,private route: ActivatedRoute, @Inject("apiUrlBase") public apiUrlBase ?: any, @Inject("apiHeaders") public apiHeaders ?: any) {}

  async ngOnInit() {
    // toolbar options
    this.toolbarOptions = [
      {name: await lastValueFrom(this.translate.get("toolbar.profile")), value: 'profile'},
      {name: await lastValueFrom(this.translate.get("toolbar.signOut")), value: 'out'}
    ]
    // params
    let params: any = JSON.parse(this.sharedSvc.getData() as string);
    let idUser = params.id;
    this.name = params.name
    this.chargeData(idUser)
    

   
  }

  chargeData(id: any) {
    let url = this.apiUrlBase + "entry/get/student-entries"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    const params = new HttpParams().set("id_check", user.profile).set("id_student",id)

    this.apiSvc.get(url,params,this.apiHeaders).subscribe(
      (resolve: any) => {
        // obtenemos los comments
        this.comments.next(resolve["comments"])

        //obtenemos las rows
        const transformedData = resolve.map((item: { idEntry: number | string,startWeek: string | number | Date; endWeek: string | number | Date; idAgreement: any; }, index: number) => {
          
          const startDate = new Date(item.startWeek);
          const endDate = new Date(item.endWeek);
          const dateRange = `${endDate.toLocaleDateString()} - ${startDate.toLocaleDateString()}`;
          
          //const dateRange = `${item.startWeek} - ${item.endWeek}`;
        
          return {
            id: item.idEntry,
            date: dateRange,
            idAgreement: item.idAgreement,
            index: "Informe " + (index + 1)
          };
        });

        this.rows.next(transformedData)

        // obtenemos las columnas
        let groupColumns = [
          {prop: 'index', name: 'index',toggle:false, checked: false},
          {prop: 'date', name: 'date',toggle:false, checked: false},
        ]
        this.columns.next(groupColumns)
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('general.chargeErr')), "error", "medium")
      }
    )
  }

  closeMenu(param: any) {
    this.menuCtrl.close();
  }

  seeInforms(param: any) {
    this.sharedSvc.setData(param)
    this.router.navigate([param.url])
  }

  
}
