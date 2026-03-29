import { TestBed } from '@angular/core/testing';

import { DiffChatService } from './diff-chat.service';

describe('DiffChatService', () => {
  let service: DiffChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiffChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
