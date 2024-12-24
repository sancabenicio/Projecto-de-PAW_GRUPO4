import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from '../service/authentication.service'; // Verifique o caminho correto

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
