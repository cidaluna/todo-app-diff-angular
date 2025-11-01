import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoTestDiffCoComponent } from './todo-test-diff-co.component';

describe('TodoTestDiffCoComponent', () => {
  let component: TodoTestDiffCoComponent;
  let fixture: ComponentFixture<TodoTestDiffCoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoTestDiffCoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoTestDiffCoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
