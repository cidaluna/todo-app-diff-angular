import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDiffComponent } from './todo-diff.component';

describe('TodoDiffComponent', () => {
  let component: TodoDiffComponent;
  let fixture: ComponentFixture<TodoDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoDiffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
