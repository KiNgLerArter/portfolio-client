import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UntypedFormGroup } from "@angular/forms";

import { EmailFieldComponent } from "./email-field.component";

describe("EmailFieldComponent", () => {
  let component: EmailFieldComponent;
  let fixture: ComponentFixture<EmailFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailFieldComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailFieldComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({});
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
