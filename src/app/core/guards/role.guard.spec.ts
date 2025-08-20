import { TestBed } from '@angular/core/testing';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

class MockAuthService {
  getUserRole(): any {
    return 'EDITOR';
  }
}

class MockRouter {
  navigate(path: string[]) { }
}

describe('roleGuard', () => {
  let guard: RoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    });
    const authService = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);
    guard = new RoleGuard(authService, router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
