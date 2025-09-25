import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetConfigModalComponent } from './dataset-config-modal.component';

describe('DatasetConfigModalComponent', () => {
  let component: DatasetConfigModalComponent;
  let fixture: ComponentFixture<DatasetConfigModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetConfigModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatasetConfigModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
