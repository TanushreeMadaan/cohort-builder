import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbiguityBanner } from './ambiguity-banner';

describe('AmbiguityBanner', () => {
  let component: AmbiguityBanner;
  let fixture: ComponentFixture<AmbiguityBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmbiguityBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmbiguityBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
