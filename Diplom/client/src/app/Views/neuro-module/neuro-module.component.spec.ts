import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuroModuleComponent } from './neuro-module.component';

describe('NeuroModuleComponent', () => {
  let component: NeuroModuleComponent;
  let fixture: ComponentFixture<NeuroModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeuroModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuroModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
