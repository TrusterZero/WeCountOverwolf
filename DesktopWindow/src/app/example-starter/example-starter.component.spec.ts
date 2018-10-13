import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleStarterComponent } from './example-starter.component';

describe('ExampleStarterComponent', () => {
  let component: ExampleStarterComponent;
  let fixture: ComponentFixture<ExampleStarterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleStarterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleStarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
