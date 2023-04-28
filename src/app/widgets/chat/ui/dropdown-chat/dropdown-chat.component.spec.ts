import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownChatComponent } from './dropdown-chat.component';

describe('DropdownChatComponent', () => {
  let component: DropdownChatComponent;
  let fixture: ComponentFixture<DropdownChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
