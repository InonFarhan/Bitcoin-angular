import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConnectingComponent } from './user-connecting.component';

describe('UserConnectingComponent', () => {
  let component: UserConnectingComponent;
  let fixture: ComponentFixture<UserConnectingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserConnectingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserConnectingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
