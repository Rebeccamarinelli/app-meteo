import { TestBed } from '@angular/core/testing';

import { UtilityMeteoService } from './utility-meteo.service';

describe('UtilityMeteoService', () => {
  let service: UtilityMeteoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityMeteoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
