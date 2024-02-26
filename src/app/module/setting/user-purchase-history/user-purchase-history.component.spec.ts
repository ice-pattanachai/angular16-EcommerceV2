import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPurchaseHistoryComponent } from './user-purchase-history.component';

describe('UserPurchaseHistoryComponent', () => {
  let component: UserPurchaseHistoryComponent;
  let fixture: ComponentFixture<UserPurchaseHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPurchaseHistoryComponent]
    });
    fixture = TestBed.createComponent(UserPurchaseHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
