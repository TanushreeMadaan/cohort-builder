import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterChip } from './filter-chips';

describe('FilterChip', () => {
  let component: FilterChip;
  let fixture: ComponentFixture<FilterChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterChip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterChip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
