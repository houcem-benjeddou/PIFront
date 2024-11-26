import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseTechniqueComponent } from './analyse-technique.component';

describe('AnalyseTechniqueComponent', () => {
  let component: AnalyseTechniqueComponent;
  let fixture: ComponentFixture<AnalyseTechniqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyseTechniqueComponent]
    });
    fixture = TestBed.createComponent(AnalyseTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
