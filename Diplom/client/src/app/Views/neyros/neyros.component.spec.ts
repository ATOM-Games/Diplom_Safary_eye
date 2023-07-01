import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeyrosComponent } from './neyros.component';

describe('NeyrosComponent', () => {
  let component: NeyrosComponent;
  let fixture: ComponentFixture<NeyrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeyrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeyrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
