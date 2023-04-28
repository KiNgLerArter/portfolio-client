import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenChatComponent } from './fullscreen-chat.component';

describe('FullscreenChatComponent', () => {
  let component: FullscreenChatComponent;
  let fixture: ComponentFixture<FullscreenChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullscreenChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullscreenChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
