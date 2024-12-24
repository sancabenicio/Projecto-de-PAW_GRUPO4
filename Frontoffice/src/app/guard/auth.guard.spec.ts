import { TestBed } from '@angular/core/testing';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let executeGuard: CanActivateFn;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    const guard = TestBed.inject(AuthGuard);
    executeGuard = guard.canActivate.bind(guard);
  });

  it('should be created', () => {
    const activatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const routerStateSnapshot = {} as RouterStateSnapshot;
    const result = executeGuard(activatedRouteSnapshot, routerStateSnapshot);
    expect(result).toBeTruthy();
  });
});
