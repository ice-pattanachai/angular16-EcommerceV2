import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountUserComponent } from './account-user.component';

describe('AccountUserComponent', () => {
  let component: AccountUserComponent;
  let fixture: ComponentFixture<AccountUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountUserComponent]
    });
    fixture = TestBed.createComponent(AccountUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function beforeEach(arg0: () => void) {
  throw new Error('Function not implemented.');
}
function expect(component: AccountUserComponent) {
  throw new Error('Function not implemented.');
}

