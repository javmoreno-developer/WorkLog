import { HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, MenuController, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, NotificationService, SharedService, User } from "@worklog-fe/core";
import { EmptyModalComponent } from "libs/core/src/lib/components/empty-modal/empty-modal.component";
import { resolve } from "path";
import { BehaviorSubject, lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-students",
  templateUrl: "./students.page.html",
  styleUrls: ["./students.page.scss"],
})
export class StudentsPage implements OnInit {
  rows = new BehaviorSubject<Object>([]);
  columns = new BehaviorSubject<Object>([]);
  mappedList = []
  units = {}
  tableStyle = "general"

  tableButtons = [
    {icon: "eye", text: "Entradas", fun: "onRoute", cssClass: "see_entries_btn", popover: false, route: "student/entries"},
    {icon: "ellipsis-vertical", text: "", fun: "onClick", cssClass: "popover_icon", popover: true, popOptions: [{name: "Eliminar", value: "delete"}, {name: "Restablecer contraseña", value: "reset"}]},
  ]

  constructor(private route:Router,private sharedSvc: SharedService,private modalCtrl: ModalController,private translate: TranslateService,private notification:NotificationService,private alert: AlertController,private apiSvc: ApiService, private menuCtrl: MenuController, @Inject("apiUrlBase") public apiUrlBase?: any, @Inject("apiHeaders") public apiHeaders?: any) {
    this.chargeData();
  }

  chargeData() {
    let url = this.apiUrlBase + "user/get/students"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const params = new HttpParams().set("id_check", user.profile)
    this.apiSvc.get(url, params, this.apiHeaders).subscribe(
      (resolve: any) => {
        // obtenemos las filas de datos 
        let studentData = this.getStudentData(resolve);

        // obtenemos las columnas
        let groupColumns = [
          {prop: 'active', name: 'active',toggle:true, checked: false},
          {prop: 'name', name: 'name',toggle:false, checked: false},
          {prop: 'scholar_year', name: 'scholar_year',toggle:false, checked: false},
          {prop: 'unit', name: 'unit',toggle:false, checked: false},
        ]
        this.columns.next(groupColumns)
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("general.chargeErr")),"error","medium")
      }
    )

  }

  getStudentData(param: User[]) {
    let url = this.apiUrlBase + "user/get/row"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const params = new HttpParams().set("id_check", user.profile)
    this.apiSvc.post(url, params, param, this.apiHeaders).subscribe(
      (resolve : any) => {
        // obtenemos la fila de nombres y emitimos el resultado total
        const result = param.map(({ name, surname,idUser,isActive }) => ({ active: isActive,id: idUser,name: `${surname}, ${name}` }));

        const mergedArray = result.map((obj, index) => Object.assign({}, obj, resolve[index]));

        this.rows.next(mergedArray)

      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("general.chargeErr")),"error","medium")
      }
    )

   

  }


  ngOnInit() { }

  closeMenu(param: any) {
    this.menuCtrl.close();
  }

  

  addModal() {
    // obtengo las option del select
    this.getAllUnits(null,false)
  }

  async getAllUnits(cellUpd: Object | null,isFile: boolean) {
    let url = this.apiUrlBase + "unit/get/all"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    const params = new HttpParams().set("id_check", user.profile)

    return await this.apiSvc.get(url, params, this.apiHeaders).subscribe(
      (resolve) => {
        this.units = resolve
        // map units
        return this.mapAllUnits(this.units, cellUpd,isFile);

      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('general.chargeErr')), "error", "medium")
      }
    )
  }

  mapAllUnits(param: any, cellUpd: Object | null,isFile: boolean) {
    this.mappedList = param.map((obj: any) => ({
      name: obj.level + " " +obj.initials,
      value: obj.idUnit,
    }));

   if(isFile) {
    this.presentModal(cellUpd,true,false)
   } else {
    this.presentModal(cellUpd,false,false)
   }

  }

  async presentModal(cellUpd: Object | null,isFile: boolean, reset: boolean, ...extras: any) {
    // cambio el boton de act o añadir
    let buttonSection = [{ text: await lastValueFrom(this.translate.get("general.update")), type: "info", fun: "onEdit" }]

    let inputSection = [{ formName: "name", type: "text", mandatory: true },{ formName: "surname", type: "text", mandatory: true },{ formName: "password", type: "text", mandatory: true },{ formName: "email", type: "email", mandatory: true }];
    let selectSection = [{ formName: "idUnit", options: this.mappedList }];
    let textSection = [await lastValueFrom(this.translate.get("students.addTitle"))]

    if (cellUpd == null) {
      buttonSection = [{ text: await lastValueFrom(this.translate.get("general.added")), type: "info", fun: "onAdd" }]
    }

    if(reset) {
      textSection = [await lastValueFrom(this.translate.get("students.resetPass"))]
      inputSection = [{formName: "pass", type: "text", mandatory: true}]
      selectSection = []
      buttonSection = [{ text: await lastValueFrom(this.translate.get("general.reset")), type: "info", fun: "onReset" }]
    }
    // create modal
    if(isFile) {
      inputSection = []
      buttonSection = []
      textSection = ["subir archivo"]
    }

    const modal = await this.modalCtrl.create({
      component: EmptyModalComponent,
      componentProps: {
        textSection: textSection,
        buttonSection: buttonSection,
        inputSection: inputSection,
        selectSection: selectSection,
        cellUpd: cellUpd,
        isFile: isFile
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
          case "massive-upload":
            this.massiveUpload(result.data)
            break;
          case "reset":
            this.resetPass(result.data,extras)
        }
      }
    });
  }

  addMultiModal() {
    this.getAllUnits(null,true)
  }

  massiveUpload(param: any) {

    let url = this.apiUrlBase + "user/add-students-set"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    let params = new HttpParams().set("id_check", user.profile).set("id_unit",param.unit.idUnit)

    this.apiSvc.post(url,params,param.data,this.apiHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('students.massiveSucc')), "success", "medium")
        this.chargeData()
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("students.massiveErr")),"error","medium")
      }
    )
  }

  addStudent(param: any) { 
    const { idUnit, ...body } = param;
   
    body["picture"] = ""
    body["linkedin"] = ""
    body["github"] = ""
    body["twitter"] = ""
    body["profile"] = "2"

    let url = this.apiUrlBase + "user/add-student"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    const params = new HttpParams().set("id_check", user.profile).set("id_unit",idUnit)
    this.apiSvc.post(url,params,body,this.apiHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('students.insertSucc')), "success", "medium")
        this.chargeData()
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('students.insertErr')), "error", "medium")
      }
    )
  }

  async promptAction(param: any, type: string) {
   
    let message = await lastValueFrom(this.translate.get("students.activeTitle"))

    if(type == 'delete') {
      message = await lastValueFrom(this.translate.get("students.deleteTitle"))
    } 

    const alert = await this.alert.create({
      header: await lastValueFrom(this.translate.get("general.warning")),
      message: message,
      buttons: [
        {
          text: await lastValueFrom(this.translate.get("general.cancel")),
          cssClass: "danger-option",
          handler: () => {
          }

        },
        {
          text: await lastValueFrom(this.translate.get("general.accept")),
          handler: async () => {
            this.deleteUser(param)
          }
        }

      ]
    });

    await alert.present();
  }


  updateStatus(param: any) {
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    param.checked = !param.checked
    let checked = 0
    if(param.checked) {
      checked = 1
    }
    // Actualizo el estado del usuario
    let url = this.apiUrlBase + "user/change-status"
    const params = new HttpParams().set("id_check", user.profile).set("id_user",param.row.id).set("new_status",checked)
    this.apiSvc.put(url,params,null,this.apiHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('students.updSucc')), "success", "medium")
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('students.updErr')), "error", "medium")
      }
    )
  }

  deleteUser(param: any) {
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    let url = this.apiUrlBase + "user/delete"
    let params = new HttpParams().set("id_check", user.profile).set("id_user",param.data.id)
    this.apiSvc.delete(url,params,this.apiHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('students.deleteSucc')), "success", "medium")
        this.chargeData()
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('students.deleteErr')), "error", "medium")
      }
    )
  }

  resetModal(param: any) {
    this.presentModal(null,false,true,param.data.id);
  }

  resetPass(param: any,id: any) {
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    let url = this.apiUrlBase + "user/update"
    let params = new HttpParams().set("id_check", user.profile).set("id_user",id[0])

    let body = {
      "password": param.data.pass
    }
    this.apiSvc.put(url,params,body,this.apiHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('students.resetSucc')), "success", "medium")
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('students.resetErr')), "error", "medium")
      }
    )
  }
  seeInforms(param: any) {
    this.sharedSvc.setData(param)
    this.route.navigate([param.url])
  }
}
