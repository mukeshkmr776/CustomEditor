import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDirectoryComponent } from './choose-directory.component';

describe('ChooseDirectoryComponent', () => {
  let component: ChooseDirectoryComponent;
  let fixture: ComponentFixture<ChooseDirectoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseDirectoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
