import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmptyPopoverComponent } from "./empty-popover.component";

describe("EmptyPopoverComponent", () => {
  let component: EmptyPopoverComponent;
  let fixture: ComponentFixture<EmptyPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmptyPopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
