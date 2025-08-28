import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Buys } from './buys';

describe('Buys', () => {
  let component: Buys;
  let fixture: ComponentFixture<Buys>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Buys]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Buys);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
