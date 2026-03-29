import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonRendererLineComponent } from './json-renderer-line.component';

describe('JsonRendererLineComponent', () => {
  let component: JsonRendererLineComponent;
  let fixture: ComponentFixture<JsonRendererLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonRendererLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonRendererLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
