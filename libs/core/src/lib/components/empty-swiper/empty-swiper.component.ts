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
  // Variables
  isFct = false;
  isMulti = true;
  isDual = false;

  myform: FormGroup;
  fctForm: FormGroup;
  dualForm: FormGroup;
  multiForm: FormGroup

  oldStudentId: any;

  // swiper variable
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

  // Slides inputs
  first_slide: any;
  second_slide_fct: any;
  second_slide_dual: any;
  cellUpd: any;

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
      username: [""]
    });
    this.fctForm = this.fb.group({
      agreementType: ['', Validators.required],
      fctEndAt: ['', Validators.required],
      fctStartAt: ['', Validators.required],
      idLabor: ['', Validators.required],
      idCompany: ['', Validators.required],
      idTeacher: ['', Validators.required],
      idStudent: ['', Validators.required],
    });
    this.dualForm = this.fb.group({
      agreementType: ['', Validators.required],
      dualEndAt: ['', Validators.required],
      dualStartAt: ['', Validators.required],
      idLabor: ['', Validators.required],
      idCompany: ['', Validators.required],
      idTeacher: ['', Validators.required],
      idStudent: ['', Validators.required],
    });
    this.multiForm = this.fb.group({
      agreementType: ['', Validators.required],
      fctEndAt: ['', Validators.required],
      fctStartAt: ['', Validators.required],
      dualEndAt: ['', Validators.required],
      dualStartAt: ['', Validators.required],
      idLabor: ['', Validators.required],
      idCompany: ['', Validators.required],
      idTeacher: ['', Validators.required],
      idStudent: ['', Validators.required],
    });
  }


  ngOnInit() {
    // Create form
    this.createForm()

  }

  // Get update form
  getActForm() {
    // Prepare form by agreement type
    if (this.cellUpd.agreementType == "dual") {
      this.myform = this.dualForm
      this.isMulti = false;
      this.isFct = false;
      this.isDual = true;
    } else if (this.cellUpd.agreementType == "fct") {
      this.myform = this.fctForm
      this.isMulti = false;
      this.isFct = true;
      this.isDual = false;
    }

    // Set default values
    const { labor, teacher, company, student, ...copy } = this.cellUpd;

    this.oldStudentId = copy.idStudent

    for (let [key, value] of Object.entries(copy)) {


      if (copy[key] != null) {
        const control = this.myform.get(key);
        if (control instanceof FormControl) {

          control.setValue(value)
        }

      }

    }

    this.turnDates()
  }


  // Change agreement type and prepare form
  changeType(param: any) {

    let formGroupConfig: any = []

    if (param == "dual") {
      // variables
      this.isDual = true;
      this.isFct = false;
      this.isMulti = false;

      // form
      if (this.myform.get("dualStartAt") == null) {
        const validators: ValidatorFn[] = [];
        validators.push(Validators.required, Validators.pattern(/^\d{2}[-]\d{2}[-]\d{4}$/));


        this.myform.addControl('dualStartAt', this.fb.control('', validators));
        this.myform.addControl('dualEndAt', this.fb.control('', validators));
      }
      this.myform.removeControl("fctStartAt")
      this.myform.removeControl("fctEndAt")

    } else if (param == "fct") {
      // variables
      this.isDual = false;
      this.isFct = true;
      this.isMulti = false;

      // form
      if (this.myform.get("fctStartAt") == null) {
        const validators: ValidatorFn[] = [];
        validators.push(Validators.required, Validators.pattern(/^\d{2}[-]\d{2}[-]\d{4}$/));


        this.myform.addControl('fctStartAt', this.fb.control('', validators));
        this.myform.addControl('fctEndAt', this.fb.control('', validators));
      }
      this.myform.removeControl("dualStartAt")
      this.myform.removeControl("dualEndAt")
    } else {
      // variables
      this.isDual = false;
      this.isFct = false;
      this.isMulti = true;

      // form
      if (this.myform.get("fctStartAt") == null) {
        const validators: ValidatorFn[] = [];
        validators.push(Validators.required, Validators.pattern(/^\d{2}[-]\d{2}[-]\d{4}$/));


        this.myform.addControl('fctStartAt', this.fb.control('', validators));
        this.myform.addControl('fctEndAt', this.fb.control('', validators));
      }
      if (this.myform.get("dualStartAt") == null) {
        const validators: ValidatorFn[] = [];
        validators.push(Validators.required, Validators.pattern(/^\d{2}[-]\d{2}[-]\d{4}$/));


        this.myform.addControl('dualStartAt', this.fb.control('', validators));
        this.myform.addControl('dualEndAt', this.fb.control('', validators));
      }
    }

    // set values
    if(this.cellUpd) {
      let { labor, teacher, company,agreementType, ...copy } = this.cellUpd;

      for (let [key, value] of Object.entries(copy)) {
  
  
        if (copy[key] != null) {
          const control = this.myform.get(key);
          if (control instanceof FormControl) {
  
            control.setValue(value)
          }
  
        }
  
      }
      
      this.turnDates()
    }
    
  }

  // Put the dates backwards
  turnDates() {
    // Get and change value
    let fctStartTurned = this.myform.get("fctStartAt")?.value.split('-').reverse().join('-');
    let fctEndTurned = this.myform.get("fctEndAt")?.value.split('-').reverse().join('-');
    let dualStartTurned = this.myform.get("dualStartAt")?.value.split('-').reverse().join('-');
    let dualEndTurned = this.myform.get("dualEndAt")?.value.split('-').reverse().join('-');

    // Set value
    this.myform.get("fctStartAt")?.setValue(fctStartTurned)
    this.myform.get("fctEndAt")?.setValue(fctEndTurned)
    this.myform.get("dualStartAt")?.setValue(dualStartTurned)
    this.myform.get("dualEndAt")?.setValue(dualEndTurned)
  }

  createForm() {
    const formGroupConfig: { [key: string]: any } = {};

    // First slide
    this.first_slide.forEach((element: any) => {
      const validators: ValidatorFn[] = [];
      validators.push(Validators.required);
      formGroupConfig[element.formName] = ['', validators];
    });

    // Second slide dual
    this.second_slide_dual.forEach((element: any) => {

      const validators: ValidatorFn[] = [];
      validators.push(Validators.required, Validators.pattern(/^\d{2}[-]\d{2}[-]\d{4}$/));
      formGroupConfig[element.formName] = ['', validators];



    });

    // Second slide fct
    this.second_slide_fct.forEach((element: any) => {

      const validators: ValidatorFn[] = [];
      validators.push(Validators.required, Validators.pattern(/^\d{2}[-]\d{2}[-]\d{4}$/));
      formGroupConfig[element.formName] = ['', validators];


    });


    this.myform = this.fb.group(formGroupConfig)

    // Set data if it is necessary
    if (this.cellUpd) {
      this.getActForm()
    }

  }

  // Check if dates in form are correct
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

  // Add trigger
  onAdd() {
    let dates = this.turnDates();

    if (this.checkDates()) {
      this.modalCtr.dismiss(this.myform.value, "submit")
    } else {
      this.modalCtr.dismiss({}, "dateError")
    }

  }

  // Edit trigger
  onEdit() {
    let dates = this.turnDates()
    if (this.checkDates()) {
      this.modalCtr.dismiss({ data: this.myform.value, oldStudentId: this.oldStudentId, idAgreement: this.cellUpd.id }, "edit")
    } else {
      this.modalCtr.dismiss({}, "dateError")
    }
  }

  // Next slide
  onNext(swiper: SwiperComponent) {
    if (swiper) {
      swiper.swiperRef.slideNext()
    }
  }


  // Previous slide
  onPrevious(swiper: SwiperComponent) {
    if (swiper) {
      swiper.swiperRef.slidePrev()
    }
  }

  selectInvokeFun(param: any, element: any) {

    if (param.changeFun != undefined) {
      //eval(`this.${param.changeFun}(this.myform.value.agreementType)`);
      eval(`this.${param.changeFun}(element.value)`);
    }
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

  // Close sidebar menu
  closeModal() {
    this.modalCtr.dismiss({ type: "cancel" })
  }



}
