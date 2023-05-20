import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmptyModalComponent } from "./empty-modal.component";

describe("EmptyModalComponent", () => {
  let component: EmptyModalComponent;
  let fixture: ComponentFixture<EmptyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmptyModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
