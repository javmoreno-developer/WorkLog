import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HolidayAdminComponent } from "./holiday-admin.component";

describe("HolidayAdminComponent", () => {
  let component: HolidayAdminComponent;
  let fixture: ComponentFixture<HolidayAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HolidayAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HolidayAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
