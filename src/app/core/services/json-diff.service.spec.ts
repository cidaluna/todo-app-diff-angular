import { TestBed } from '@angular/core/testing';

import { JsonDiffService } from './json-diff.service';

describe('JsonDiffService', () => {
  let service: JsonDiffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonDiffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
