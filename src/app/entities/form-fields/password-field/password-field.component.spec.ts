import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UntypedFormGroup } from "@angular/forms";

import { PasswordFieldComponent } from "./password-field.component";

describe("PasswordFieldComponent", () => {
  let component: PasswordFieldComponent;
  let fixture: ComponentFixture<PasswordFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordFieldComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordFieldComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({});
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
