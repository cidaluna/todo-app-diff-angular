import { TestBed } from '@angular/core/testing';

import { DeltacoService } from './deltaco.service';

describe('DeltacoService', () => {
  let service: DeltacoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeltacoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
