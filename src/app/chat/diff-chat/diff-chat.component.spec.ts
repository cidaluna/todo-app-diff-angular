import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffChatComponent } from './diff-chat.component';

describe('DiffChatComponent', () => {
  let component: DiffChatComponent;
  let fixture: ComponentFixture<DiffChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiffChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiffChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
