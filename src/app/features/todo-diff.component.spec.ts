import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDiffComponent } from './todo-diff.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('TodoDiffComponent', () => {
  let component: TodoDiffComponent;
  let fixture: ComponentFixture<TodoDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoDiffComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect changed primitive fields', () => {
    const original = { name: 'A', age: 20, active: true };
    const edited = { name: 'B', age: 21, active: false };
    const delta = component.compareObjects(original, edited);
    expect(delta.name).toBe('changed');
    expect(delta.age).toBe('changed');
    expect(delta.active).toBe('changed');
  });

  it('should detect equal primitive fields', () => {
    const original = { name: 'A', age: 20 };
    const edited = { name: 'A', age: 20 };
    const delta = component.compareObjects(original, edited);
    expect(delta.name).toBe('equal');
    expect(delta.age).toBe('equal');
  });

  it('should detect added and removed fields', () => {
    const original = { name: 'A' };
    const edited = { name: 'A', extra: 123 };
    const delta = component.compareObjects(original, edited);
    expect(delta.extra).toBe('added');
    expect(delta.name).toBe('equal');

    const edited2 = { };
    const delta2 = component.compareObjects(original, edited2);
    expect(delta2.name).toBe('removed');
  });

  it('should detect changes in arrays of primitives', () => {
    const original = { arr: [1, 2, 3] };
    const edited = { arr: [1, 4, 3, 5] };
    const delta = component.compareObjects(original, edited);
    expect(delta.arr[0]).toBe('equal');
    expect(delta.arr[1]).toBe('changed');
    expect(delta.arr[2]).toBe('equal');
    expect(delta.arr[3]).toBe('added');
  });

  it('should detect changes in nested objects', () => {
    const original = { obj: { x: 1, y: 2 } };
    const edited = { obj: { x: 1, y: 3, z: 4 } };
    const delta = component.compareObjects(original, edited);
    expect(delta.obj.x).toBe('equal');
    expect(delta.obj.y).toBe('changed');
    expect(delta.obj.z).toBe('added');
  });

  it('should detect removed fields in nested objects', () => {
    const original = { obj: { x: 1, y: 2 } };
    const edited = { obj: { x: 1 } };
    const delta = component.compareObjects(original, edited);
    expect(delta.obj.x).toBe('equal');
    expect(delta.obj.y).toBe('removed');
  });
});
