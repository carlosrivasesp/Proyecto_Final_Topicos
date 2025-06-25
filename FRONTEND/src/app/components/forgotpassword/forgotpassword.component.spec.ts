import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotpasswordComponent } from './forgotpassword.component';

describe('ForgotpasswordComponent', () => {
  let component: ForgotpasswordComponent;
  let fixture: ComponentFixture<ForgotpasswordComponent>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['forgotPassword']);

    await TestBed.configureTestingModule({
      declarations: [ForgotpasswordComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});