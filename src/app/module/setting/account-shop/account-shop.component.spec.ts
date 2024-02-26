import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountShopComponent } from './account-shop.component';

describe('AccountShopComponent', () => {
  let component: AccountShopComponent;
  let fixture: ComponentFixture<AccountShopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountShopComponent]
    });
    fixture = TestBed.createComponent(AccountShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
