import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffChat2Component } from './diff-chat-2.component';

describe('DiffChat2Component', () => {
  let component: DiffChat2Component;
  let fixture: ComponentFixture<DiffChat2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiffChat2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiffChat2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
