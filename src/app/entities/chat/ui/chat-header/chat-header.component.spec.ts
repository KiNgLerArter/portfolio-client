import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { ChatServiceStub } from "../../test";
import { ChatService } from "../../services";
import { ChatHeaderComponent } from "./chat-header.component";
import { MatDialogStub } from "@shared/lib/material-design/dialog";

describe("ChatHeaderComponent", () => {
  let component: ChatHeaderComponent;
  let fixture: ComponentFixture<ChatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatHeaderComponent],
      providers: [
        { provide: ChatService, useValue: ChatServiceStub },
        { provide: MatDialog, useValue: MatDialogStub }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
