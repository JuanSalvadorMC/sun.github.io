import { TestBed } from '@angular/core/testing';

import { VistaloginService } from './vistalogin.service';

describe('VistaloginService', () => {
  let service: VistaloginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VistaloginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
