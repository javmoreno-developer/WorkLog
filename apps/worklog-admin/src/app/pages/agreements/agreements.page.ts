import { HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { AlertController, MenuController, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, NotificationService } from "@worklog-fe/core";
import { EmptyModalComponent } from "libs/core/src/lib/components/empty-modal/empty-modal.component";
import { EmptySwiperComponent } from "libs/core/src/lib/components/empty-swiper/empty-swiper.component";
import { LocaleService } from "libs/core/src/lib/services/locale.service";
import { resolve } from "path";
import { BehaviorSubject, Observable, lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-agreements",
  templateUrl: "./agreements.page.html",
  styleUrls: ["./agreements.page.scss"],
})
export class AgreementsPage implements OnInit {
  // Variables
  toolbarOptions: any;
  tableStyle = "general"

  tableButtons = [
    { icon: "information-circle", text: "", fun: "onInfo", cssClass: "download_icon", popover: false },
    { icon: "create", text: "", fun: "onEdit", cssClass: "edit_icon", popover: false },
    { icon: "close", text: "", fun: "onDelete", cssClass: "delete_icon", popover: false },
  ]
  rows: BehaviorSubject<Object> = new BehaviorSubject<Object>([]);
  columns: BehaviorSubject<Object> = new BehaviorSubject<Object>([]);
  laborList = []
  teacherList = []
  companyList = []
  studentsList = []


  defaultLang: any = "";
  languages: any;


  constructor(private locale: LocaleService, private alertCtrl: AlertController, private modalCtrl: ModalController, private notification: NotificationService, private apiSvc: ApiService, private translate: TranslateService, private menuCtrl: MenuController, @Inject("apiUrlBase") private apiUrlBase?: any, @Inject("apiHeaders") private apiHeaders?: any) { }

  async ngOnInit() {

    // Set default language
    this.defaultLang = this.locale.locale

    // Set all toolbar options
    this.toolbarOptions = [
      { name: await lastValueFrom(this.translate.get("toolbar.profile")), value: 'profile' },
      { name: await lastValueFrom(this.translate.get("toolbar.signOut")), value: 'out' }
    ]
    // Set all idioms
    this.languages = [
      { name: await lastValueFrom(this.translate.get("languages.english")), value: "en-en" },
      { name: await lastValueFrom(this.translate.get("languages.spanish")), value: "es-es" }
    ]

    // toolbar options
    this.toolbarOptions = [
      { name: await lastValueFrom(this.translate.get("toolbar.profile")), value: 'profile' },
      { name: await lastValueFrom(this.translate.get("toolbar.signOut")), value: 'out' }
    ]

    // data
    this.chargeData()
  }

  addModal() {
    this.getAllLabors(null);
  }

  // Get initial data
  chargeData() {
    let url = this.apiUrlBase + "agreement/get/all"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const params = new HttpParams().set("id_check", user.profile).set("complete", true)

    //this.getAllLabors()

    this.apiSvc.get(url, params, this.apiHeaders).subscribe(
      (resolve: any) => {
        let preparedRows: any = []
        // preparamos el array
        resolve.forEach((element: any) => {
          if (element.fctStartAt != null) {
            preparedRows.push({ id: element.idAgreement, dualStartAt: element.dualStartAt, dualEndAt: element.dualEndAt, fctEndAt: element.fctEndAt, fctStartAt: element.fctStartAt, agreementType: element.agreementType, idLabor: element.idLabor, idCompany: element.idCompany, idTeacher: element.idTeacher, labor: element.data[1], teacher: element.data[2], company: element.data[0], idStudent: element.data[3][0], student: element.data[3][1] })
          } else {
            preparedRows.push({ id: element.idAgreement, dualEndAt: element.dualEndAt, dualStartAt: element.dualStartAt, agreementType: element.agreementType, fctEndAt: element.fctEndAt, fctStartAt: element.fctStartAt, idLabor: element.idLabor, idCompany: element.idCompany, idTeacher: element.idTeacher, labor: element.data[1], teacher: element.data[2], company: element.data[0], idStudent: element.data[3][0], student: element.data[3][1] })
          }
        });
        // obtenemos las filas
        this.rows.next(preparedRows)

        // obtenemos las columnas
        let groupColumns = [
          { prop: 'student', name: 'student', toggle: false, checked: false },
          { prop: 'teacher', name: 'teacher', toggle: false, checked: false },
          { prop: 'labor', name: 'labor', toggle: false, checked: false },
        ]
        this.columns.next(groupColumns)
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("general.chargeErr")), "error", "medium")
      }
    )
  }

  // Close sidebar menu
  closeMenu(param: any) {
    this.menuCtrl.close();
  }

  // Show general modal
  async presentModal(cellUpd: Object | null, event: any | null, type: string) {

    // cambio el boton de act o añadir
    let buttonSection: any = []

    let inputSection: any = [];
    let selectSection: any = [];
    let textSection: any = []

    if (type == "info") {
      let agreementType = await lastValueFrom(this.translate.get("agreements.type", { type: event.agreementType }))
      let company = await lastValueFrom(this.translate.get("agreements.company", { company: event.company }))

      let fctEnd = await lastValueFrom(this.translate.get("agreements.fctEnd", { fctEnd: event.fctEndAt }))
      let fctStart = await lastValueFrom(this.translate.get("agreements.fctStart", { fctStart: event.fctStartAt }))
      let dualEnd = await lastValueFrom(this.translate.get("agreements.dualEnd", { dualEnd: event.dualEndAt }))
      let dualStart = await lastValueFrom(this.translate.get("agreements.dualStart", { dualStart: event.dualStartAt }))

      let labor = await lastValueFrom(this.translate.get("agreements.labor", { labor: event.labor }))
      let teacher = await lastValueFrom(this.translate.get("agreements.teacher", { teacher: event.teacher }))
      let student = await lastValueFrom(this.translate.get("agreements.student", { student: event.student }))

      if (event.agreementType == "fct") {
        textSection = [await lastValueFrom(this.translate.get("agreements.infoTitleModal")), agreementType, company, fctStart, fctEnd, labor, teacher, student]
      } else if (event.agreementType == "dual") {
        textSection = [await lastValueFrom(this.translate.get("agreements.infoTitleModal")), agreementType, company, dualStart, dualEnd, labor, teacher, student]
      } else {
        textSection = [await lastValueFrom(this.translate.get("agreements.infoTitleModal")), agreementType, company, dualStart, dualEnd, fctStart, fctEnd, labor, teacher, student]
      }

    }


    const modal = await this.modalCtrl.create({
      component: EmptyModalComponent,
      componentProps: {
        textSection: textSection,
        buttonSection: buttonSection,
        inputSection: inputSection,
        selectSection: selectSection,
        cellUpd: cellUpd,
        isFile: false,
        isMulti: true
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
            //this.addAgreement(result.data);
            break;
          case "edit":
            break;
        }
      }
    });
  }

  // Add agreement operation
  addAgreement(body: any) {

    // add resting fields
    if (body.dualStartAt != undefined && body.fctStartAt == undefined) {
      body.fctStartAt = null;
      body.fctEndAt = null;
    } else if (body.dualStartAt == undefined && body.fctStartAt != undefined) {
      body.dualStartAt = null;
      body.dualEndAt = null;
    }

    let url = this.apiUrlBase + "agreement/add"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const params = new HttpParams().set("id_check", user.profile).set("id_student", body.idStudent)

    this.apiSvc.post(url, params, body, this.apiHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('agreements.addMsg')), "success", "medium")
        this.chargeData();
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('agreements.addErr')), "error", "medium")
      }
    )
    //this.apiSvc.post(url,params)
  }

  getAllLabors(actParam: any | null) {
    let url = this.apiUrlBase + "user/get/laborals"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const params = new HttpParams().set("id_check", user.profile)

    this.apiSvc.get(url, params, this.apiHeaders).subscribe(
      (resolve: any) => {
        let result = resolve.map((obj: any) => ({
          name: obj.surname + " " + obj.name,
          value: obj.idUser,
        }));
        this.laborList = result;
        //this.presentModal(null,null,'add')
        this.getAllTeachers(actParam)
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("general.chargeErr")), "error", "medium")
      }
    )

  }

  getAllTeachers(actParam: any | null) {
    let url = this.apiUrlBase + "user/get/teachers"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const params = new HttpParams().set("id_check", user.profile)

    this.apiSvc.get(url, params, this.apiHeaders).subscribe(
      (resolve: any) => {
        let result = resolve.map((obj: any) => ({
          name: obj.surname + ", " + obj.name,
          value: obj.idUser,
        }));
        this.teacherList = result;
        this.getAllCompanies(actParam);
        //this.presentModal(null,null,'add')
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("general.chargeErr")), "error", "medium")
      }
    )
  }

  getAllCompanies(actParam: any | null) {
    let url = this.apiUrlBase + "company/get/all"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    const params = new HttpParams().set("id_check", user.profile)

    this.apiSvc.get(url, params, this.apiHeaders).subscribe(
      (resolve: any) => {
        let result = resolve.map((obj: any) => ({
          name: obj.name,
          value: obj.idCompany,
        }));
        this.companyList = result;
        this.getAllUsers(actParam)
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("general.chargeErr")), "error", "medium")
      }
    )
  }

  getAllUsers(actParam: any | null) {
    let url = this.apiUrlBase + "user/get/students/no-agreement"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    const params = new HttpParams().set("id_check", user.profile)

    this.apiSvc.get(url, params, this.apiHeaders).subscribe(
      (resolve: any) => {
        let result = resolve.map((obj: any) => ({
          name: obj.surname + " " + obj.name,
          value: obj.idUser,
        }));
      
        this.studentsList = result;
        this.presentSwiper(actParam)
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("general.chargeErr")), "error", "medium")
      }
    )
  }

  // Show general swiper
  async presentSwiper(cellUpd: any | null) {

    // placeholder msg
    let typePlaceholder = await lastValueFrom(this.translate.get("agreements.typeForm"))
    let laborPlaceholder = await lastValueFrom(this.translate.get("agreements.laborForm"))
    let teacherPlaceholder = await lastValueFrom(this.translate.get("agreements.teacherForm"))
    let companyPlaceholder = await lastValueFrom(this.translate.get("agreements.companyForm"))
    let studentPlaceholder = await lastValueFrom(this.translate.get("agreements.studentForm"))
    let fctStartPlaceholder = await lastValueFrom(this.translate.get("agreements.fctStartForm"))
    let dualStartPlaceholder = await lastValueFrom(this.translate.get("agreements.dualStartForm"))
    let dualEndPlaceholder = await lastValueFrom(this.translate.get("agreements.dualEndForm"))
    let fctEndPlaceholder = await lastValueFrom(this.translate.get("agreements.fctEndForm"))

    let mappedList = [{ name: "fct", value: "fct" }, { name: "dual", value: "dual" }, { name: "fct+dual", value: "fct+dual" }]

    /// Select and input

    // first slide
    let alumnSelect: any = { formName: "idStudent", placeholder: studentPlaceholder, options: this.studentsList }
    let agreementSelect: any = { formName: "agreementType", placeholder: typePlaceholder, options: mappedList, changeFun: "changeType" }
    let laborSelect: any = { formName: "idLabor", placeholder: laborPlaceholder, options: this.laborList }
    let teacherSelect: any = { formName: "idTeacher", placeholder: teacherPlaceholder, options: this.teacherList }
    let companySelect: any = { formName: "idCompany", placeholder: companyPlaceholder, options: this.companyList }

    // second slide
    let fctStartInput= { formName: "fctStartAt", type: "fctStartAt", mandatory: true, placeholder: fctStartPlaceholder }
    let fctEndInput = { formName: "fctEndAt", type: "fctEndAt", mandatory: true, placeholder: fctEndPlaceholder }
    let dualStartInput = { formName: "dualStartAt", type: "dualStartAt", mandatory: true, placeholder: dualStartPlaceholder }
    let dualEndInput = { formName: "dualEndAt", type: "dualEndAt", mandatory: true, placeholder: dualEndPlaceholder }


   
    // Create modal
    const modal = await this.modalCtrl.create({
      component: EmptySwiperComponent,
      componentProps: {
        first_slide: [agreementSelect,alumnSelect, laborSelect, teacherSelect, companySelect],
        second_slide_fct: [fctStartInput, fctEndInput],
        second_slide_dual: [dualStartInput, dualEndInput],
        cellUpd: cellUpd
      },
      cssClass: 'general-modal'
    });

    modal.present();

    modal.onDidDismiss().then(async result => {
      if (result.data) {
        switch (result.role) {
          case "cancel":
            break;
          case "submit":
            this.addAgreement(result.data);
            break;
          case "edit":
            this.editAgreement(result.data);
            break;
          case "dateError":
            this.notification.showToast(await lastValueFrom(this.translate.get('agreements.badForm')), "error", "medium")
            break;
        }
      }
    });
  }

  // Edit agreement operation
  editAgreement(param: any) {
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    let url = this.apiUrlBase + "agreement/update"
    let params = new HttpParams().set("id_check", user.profile).set("id_agreement", param.idAgreement).set("id_student", param.data.idStudent)

    delete param.data.idStudent


    if (param.data.agreementType == "fct") {
      param.data.dualEndAt = null;
      param.data.dualStartAt = null;
    } else if (param.data.agreementType == "dual") {
      param.data.fctEndAt = null;
      param.data.fctStartAt = null;
    }

    
    this.apiSvc.put(url, params, param.data, this.apiHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("agreements.updMsg")), "success", "medium")
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("agreements.updErr")), "error", "medium")
      }
    )
  }

  // Show general alert
  async promptDelete(param: any) {
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const alert = await this.alertCtrl.create({
      header: await lastValueFrom(this.translate.get("general.warning")),
      message: await lastValueFrom(this.translate.get("agreements.deleteTitle")),
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
            // Se borra el modulo
            let url = this.apiUrlBase + "agreement/delete"
            let user = JSON.parse(localStorage.getItem("sessionData") as string)
            const params = new HttpParams().set("id_check", user.profile).set("id_agreement", param.data.id)
            this.apiSvc.delete(url, params, this.apiHeaders).subscribe(
              async (resolve) => {
                this.notification.showToast(await lastValueFrom(this.translate.get('agreements.deleteMsg')), "success", "medium")
                this.chargeData();
              },
              async (error) => {
                this.notification.showToast(await lastValueFrom(this.translate.get('agreements.deleteErr')), "error", "medium")
              }
            )

          }
        }

      ]
    });

    await alert.present();
  }

  // Show update alert
  promptUpdate(event: any) {

    this.getAllLabors(event.data);
  }

  // Change the idiom of the entire app (event from child component)
  changeIdiom(param: any) {
    this.translate.setDefaultLang(param)
    this.locale.registerCulture(param)
  }
}
