import { HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MenuController, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, NotificationService } from "@worklog-fe/core";
import { EmptyModalComponent } from "libs/core/src/lib/components/empty-modal/empty-modal.component";
import { BehaviorSubject, Observable, lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-agreements",
  templateUrl: "./agreements.page.html",
  styleUrls: ["./agreements.page.scss"],
})
export class AgreementsPage implements OnInit {
  
  toolbarOptions: any;
  tableStyle = "general"

  tableButtons = [
    { icon: "information-circle", text: "", fun: "onInfo", cssClass: "download_icon", popover: false },
    { icon: "create", text: "", fun: "onClick", cssClass: "edit_icon", popover: false },
    { icon: "close", text: "", fun: "onClick", cssClass: "delete_icon", popover: false },
  ]
  rows: BehaviorSubject<Object> = new BehaviorSubject<Object>([]);
  columns: BehaviorSubject<Object> = new BehaviorSubject<Object>([]);
  laborList = []
  teacherList = []
  companyList = []

  constructor(private modalCtrl:ModalController,private notification:NotificationService,private apiSvc: ApiService,private translate: TranslateService,private menuCtrl: MenuController,@Inject("apiUrlBase") private apiUrlBase ?: any,@Inject("apiHeaders") private apiHeaders ?: any) {}

  async ngOnInit() {
    // toolbar options
    this.toolbarOptions = [
      {name: await lastValueFrom(this.translate.get("toolbar.profile")), value: 'profile'},
      {name: await lastValueFrom(this.translate.get("toolbar.signOut")), value: 'out'}
    ]

    // data
    this.chargeData()
  }

  addModal() {
    this.getAllLabors();
  }

  chargeData() {
    let url = this.apiUrlBase + "agreement/get/all"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const params = new HttpParams().set("id_check", user.profile).set("complete",true)

    //this.getAllLabors()

    this.apiSvc.get(url,params,this.apiHeaders).subscribe(
      (resolve: any) => {
        let preparedRows: any = []
        // preparamos el array
        resolve.forEach( (element: any) => {
            console.log(element)
            if(element.fctStartAt != null) {
              preparedRows.push({id: element.idAgreement,end: element.fctEndAt, start: element.fctStartAt,agreementType: element.agreementType,idLabor: element.idLabor,idCompany:element.idCompany,idTeacher: element.idTeacher,labor: element.data[1],teacher: element.data[2],company: element.data[0],idStudent: element.data[3][0], student: element.data[3][1]})
            } else {
              preparedRows.push({id: element.idAgreement,end: element.dualEndAt, start: element.dualStartAt,agreementType: element.agreementType,idLabor: element.idLabor,idCompany:element.idCompany,idTeacher: element.idTeacher,labor: element.data[1],teacher: element.data[2],company: element.data[0],idStudent: element.data[3][0], student: element.data[3][1]})
            }
        });
        // obtenemos las filas
        this.rows.next(preparedRows)
        
        // obtenemos las columnas
        let groupColumns = [
          {prop: 'student', name: 'student',toggle:false, checked: false},
          {prop: 'teacher', name: 'teacher',toggle:false, checked: false},
          {prop: 'labor', name: 'labor',toggle:false, checked: false},
        ]
        this.columns.next(groupColumns)
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("general.chargeErr")),"error","medium")
      }
    )
  }

  closeMenu(param: any) {
    this.menuCtrl.close();
  }

  async presentModal(cellUpd: Object | null,event: any | null,type: string) {
    // cambio el boton de act o añadir
    let buttonSection: any = []

    let inputSection: any = [];
    let selectSection: any = [];
    let textSection: any = []

    if(type == "info") {
      let agreementType = await lastValueFrom(this.translate.get("agreements.type", {type: event.agreementType}))
      let company = await lastValueFrom(this.translate.get("agreements.company", {company: event.company}))
      let end = await lastValueFrom(this.translate.get("agreements.end", {end: event.end}))
      let start = await lastValueFrom(this.translate.get("agreements.start", {start: event.start}))
      let labor = await lastValueFrom(this.translate.get("agreements.labor", {labor: event.labor}))
      let teacher = await lastValueFrom(this.translate.get("agreements.teacher", {teacher: event.teacher}))
      let student = await lastValueFrom(this.translate.get("agreements.student", {student: event.student}))
      textSection = [await lastValueFrom(this.translate.get("agreements.infoTitleModal")),agreementType,company,end,start,labor,teacher,student]
    }

    if(type == "add") {
      // variables
      let typePlaceholder = await lastValueFrom(this.translate.get("agreements.typeForm"))
      let laborPlaceholder = await lastValueFrom(this.translate.get("agreements.laborForm"))
      let teacherPlaceholder = await lastValueFrom(this.translate.get("agreements.teacherForm"))
      let companyPlaceholder = await lastValueFrom(this.translate.get("agreements.companyForm"))

      let mappedList = [{name: "fct",value: "fct"},{name: "dual",value: "dual"},{name: "fct+dual",value: "fct+dual"}]

      // sections
      inputSection = [{ formName: "start", type: "start", mandatory: true },{ formName: "end", type: "end", mandatory: true }]
      selectSection = [{ formName: "type", options: mappedList, placeholder: typePlaceholder},{ formName: "labor", options: this.laborList, placeholder: laborPlaceholder },{ formName: "teacher", options: this.teacherList, placeholder: teacherPlaceholder },{ formName: "company", options: this.companyList,placeholder: companyPlaceholder }]
      textSection = [await lastValueFrom(this.translate.get("agreements.addTitleModal"))]
      buttonSection = [{ text: await lastValueFrom(this.translate.get("general.added")), type: "info", fun: "onAdd" }]
    }
    
    const modal = await this.modalCtrl.create({
      component: EmptyModalComponent,
      componentProps: {
        textSection: textSection,
        buttonSection: buttonSection,
        inputSection: inputSection,
        selectSection: selectSection,
        cellUpd: cellUpd,
        isFile: false
      },
      cssClass: 'general-modal'
    });

    modal.present();

    modal.onDidDismiss().then(result => {
      if (result.data) {
        switch (result.role) {
          case "cancel":
            break;
          case "submit":
            this.addStudent(result.data);
            break;
          case "edit":
            break;
        }
      }
    });
  }

  addStudent(param: any) {
    console.log(param)
    let url = this.apiUrlBase + "agreement/add"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const params = new HttpParams().set("id_check", user.profile)

    //this.apiSvc.post(url,params)
  }

  getAllLabors() {
    let url = this.apiUrlBase + "user/get/laborals"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const params = new HttpParams().set("id_check", user.profile)

    this.apiSvc.get(url,params,this.apiHeaders).subscribe(
      (resolve: any) => {
        console.log(resolve)
        this.laborList = resolve;
        //this.presentModal(null,null,'add')
        this.getAllTeachers()
      },
      (error) => {
        console.log(error)
      }
    )

  }

  getAllTeachers() {
    let url = this.apiUrlBase + "user/get/teachers"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const params = new HttpParams().set("id_check", user.profile)

    this.apiSvc.get(url,params,this.apiHeaders).subscribe(
      (resolve: any) => {
        this.teacherList = resolve;
        this.getAllCompanies();
        //this.presentModal(null,null,'add')
      },
      (error) => {
        console.log(error)
      }
    )
  }

  getAllCompanies() {
    let url = this.apiUrlBase + "company/get/all"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    const params = new HttpParams().set("id_check", user.profile)

    this.apiSvc.get(url,params,this.apiHeaders).subscribe(
      (resolve: any) => {
        this.companyList = resolve;
       // this.getAllCompanies();
        this.presentModal(null,null,'add')
      },
      (error) => {
        console.log(error)
      }
    )
  }
}
