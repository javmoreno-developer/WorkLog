import { Component, Input } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { IonInput, ModalController } from "@ionic/angular";
import { SwiperComponent } from "swiper/angular";

@Component({
  selector: "worklog-fe-empty-swiper",
  templateUrl: "./empty-swiper.component.html",
  styleUrls: ["./empty-swiper.component.scss"],
})
export class EmptySwiperComponent {
  slides: any = []
  isFct = true;
  myform: FormGroup;
  myformCopy: FormGroup;
  first_slide: any;
  second_slide_fct: any;
  second_slide_dual: any;
  isMulti = false;
  cellUpd: any;
  oldStudentId: any;

  options = {
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  @Input("first_slide") set _first_slide(n: any) {
    this.first_slide = n;
  }
  @Input("second_slide_fct") set _second_slide_fct(n: any) {
    this.second_slide_fct = n;
  }
  @Input("second_slide_dual") set _second_slide_dual(n: any) {
    this.second_slide_dual = n;
  }
  @Input("cellUpd") set _cellUpd(n: any) {
    this.cellUpd = n
  }

  constructor(private fb: FormBuilder, private modalCtr: ModalController) {
    this.myform = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.myformCopy = this.myform;
  }

  onNext(swiper: SwiperComponent) {
    if (swiper) {
      swiper.swiperRef.slideNext()
    }
  }

  onAdd() {
    let dates = this.turnDates();

    if (this.checkDates()) {
      this.modalCtr.dismiss(this.myform.value, "submit")
    } else {
      console.log("bad form bro")
    }

  }

  onEdit() {
    let dates = this.turnDates()
    if (this.checkDates()) {
      this.modalCtr.dismiss({ data: this.myform.value, oldStudentId: this.oldStudentId, idAgreement: this.cellUpd.id }, "edit")
    } else {
      console.log("bad form bro")
    }
  }

  onPrevious(swiper: SwiperComponent) {
    if (swiper) {
      swiper.swiperRef.slidePrev()
    }
  }

  checkDates(): boolean {
    if (this.isMulti) {
      let fctStartDate = new Date(this.myform.get("fctStartAt")?.value)
      let fctEndDate = new Date(this.myform.get("fctEndAt")?.value)
      let dualStartDate = new Date(this.myform.get("dualStartAt")?.value)
      let dualEndDate = new Date(this.myform.get("dualEndAt")?.value)

      return ((fctStartDate < fctEndDate) && (dualStartDate < dualEndDate) && (dualEndDate < fctStartDate))
    } else if (this.isFct) {
      let fctStartDate = new Date(this.myform.get("fctStartAt")?.value)
      let fctEndDate = new Date(this.myform.get("fctEndAt")?.value)

      return (fctStartDate < fctEndDate)
    } else {
      let dualStartDate = new Date(this.myform.get("dualStartAt")?.value)
      let dualEndDate = new Date(this.myform.get("dualEndAt")?.value)


      return (dualStartDate < dualEndDate)
    }
  }


  turnDates() {
    // get and change value
    let fctStartTurned = this.myform.get("fctStartAt")?.value.split('-').reverse().join('-');
    let fctEndTurned = this.myform.get("fctEndAt")?.value.split('-').reverse().join('-');
    let dualStartTurned = this.myform.get("dualStartAt")?.value.split('-').reverse().join('-');
    let dualEndTurned = this.myform.get("dualEndAt")?.value.split('-').reverse().join('-');

    // set value
    this.myform.get("fctStartAt")?.setValue(fctStartTurned)
    this.myform.get("fctEndAt")?.setValue(fctEndTurned)
    this.myform.get("dualStartAt")?.setValue(dualStartTurned)
    this.myform.get("dualEndAt")?.setValue(dualEndTurned)
  }

  assignType(type: any) {
    if (type == "dual") {
      this.isFct = false;
      this.isMulti = false;
      this.myform = this.myformCopy; 
    } else if (type == "fct") {
      this.isFct = true;
      this.isMulti = false;

      this.myform = this.myformCopy;
    } else {
      this.isMulti = true;
      this.myform = this.myformCopy;

    }
  }

  changeType(type: any) {
    if (type == "dual") {
      this.isFct = false;
      this.isMulti = false;
      this.myform = this.myformCopy;

      // elimino los campos de fct del form actual
      this.myform.removeControl("fctStartAt")
      this.myform.removeControl("fctEndAt")

    } else if (type == "fct") {
      this.isFct = true;
      this.isMulti = false;

      this.myform = this.myformCopy;

      // elimino los campos de dual del form actual
      this.myform.removeControl("dualStartAt")
      this.myform.removeControl("dualEndAt")

    } else {
      this.isMulti = true;
      this.myform = this.myformCopy;

    }
  }

  selectInvokeFun(param: any) {
    if (param.changeFun != undefined) {
      console.log(this.myform.value)
      eval(`this.${param.changeFun}(this.myform.value.agreementType)`);
    }
  }

  ngOnInit() {
    this.myform = this.fb.group(this.createFormGroupConfig());
    this.myformCopy = this.myform;
    console.log(this.cellUpd)
    if (this.cellUpd) {
      this.getActForm()
    }


  }

  getActForm() {
    console.log(this.myform.controls)

    const { labor, teacher, company, student, ...copy } = this.cellUpd;

    console.log(copy)
    this.oldStudentId = copy.idStudent

   for (let [key, value] of Object.entries(copy)) {

     
      if (copy[key] != null) {
        console.log(copy[key])
        const control = this.myform.get(key);
        if (control instanceof FormControl) {

          control.setValue(value)
        }
      }

    }
    console.log(copy.agreementType)
    this.assignType(copy.agreementType)
    this.turnDates()


  }

  createFormGroupConfig() {
    const formGroupConfig: { [key: string]: any } = {};

    // first slide
    this.first_slide.forEach((element: any) => {
      const validators: ValidatorFn[] = [];
      validators.push(Validators.required);
      formGroupConfig[element.formName] = ['', validators];
    });


    // second slide dual
    this.second_slide_dual.forEach((element: any) => {
      const validators: ValidatorFn[] = [];
      validators.push(Validators.required, Validators.pattern(/^\d{2}[-]\d{2}[-]\d{4}$/));
      formGroupConfig[element.formName] = ['', validators];
    });

    // second slide fct
    this.second_slide_fct.forEach((element: any) => {
      const validators: ValidatorFn[] = [];
      validators.push(Validators.required, Validators.pattern(/^\d{2}[-]\d{2}[-]\d{4}$/));
      formGroupConfig[element.formName] = ['', validators];
    });

    console.log(formGroupConfig)
    return formGroupConfig
  }


  buttonClicked(fun: any, swiper: SwiperComponent) {
    if (fun == "onNext" || fun == "onPrevious") {
      eval(`this.${fun}(swiper)`);
    } else {
      eval(`this.${fun}()`);
    }

  }

  onInputFocus(event: any) {
    const ionItem = event.target.closest('ion-item');
    ionItem.classList.add('input-focus');
  }

  onInputBlur(event: any, field: string) {
    if (this.myform.controls[field].valid) {
      const ionItem = event.target.closest('ion-item');
      ionItem.classList.remove('input-focus');
    }
  }

  closeModal() {
    this.modalCtr.dismiss({ type: "cancel" })
  }

  onInputChange(event: any, input: any) {

  }

}
