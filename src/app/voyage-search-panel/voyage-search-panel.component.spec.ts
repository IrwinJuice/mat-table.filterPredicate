import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoyageSearchPanelComponent } from './voyage-search-panel.component';

describe('VoyageSearchPanelComponent', () => {
  let component: VoyageSearchPanelComponent;
  let fixture: ComponentFixture<VoyageSearchPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoyageSearchPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoyageSearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
