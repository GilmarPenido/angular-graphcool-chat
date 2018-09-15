import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ErrorService } from '../../../core/services/error.service';
import { MatSnackBar } from '@angular/material';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    
  loginForm: FormGroup;

  configs= {
    isLogin: true,
    actionText: 'SignIn',
    buttonActionText: 'Create account',
    isLoading: false
  }

  private nameControl = 
  new FormControl('', [Validators.required, Validators.minLength(5)] )

  private alive = true;
  
  @HostBinding('class.app-login-spinner') private applySpinnerClass = true;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {

    this.createForm()
  }

  createForm() :void{
    
    this.loginForm = this.formBuilder.group({
        
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5) ]]

    });

  }

  onSubmit(): void{
      
    this.configs.isLoading = true;

    const operation = 
      this.configs.isLogin 
        ? this.authService.signinUser(this.loginForm.value) 
        : this.authService.signupUser(this.loginForm.value);

    operation
    .pipe(
      takeWhile(()=> this.alive)
    )
    .subscribe(res => {
        console.log('redirecting...', res)
        this.configs.isLoading = false;
      }, 
      err => {
        
        this.snackBar.open(this.errorService.getErrorMessage(err), 'Done', {duration:5000, verticalPosition: 'top'});
        this.configs.isLoading = false;
      },
      () => console.log('Observable complete.')
    )

  }

  changeAction(){
    
    this.configs.isLogin = !this.configs.isLogin;
    this.configs.actionText = !this.configs.isLogin ? 'SignUp' : 'SignIn';
    this.configs.buttonActionText = !this.configs.isLogin ? 'Already have account' : 'Create account';

    !this.configs.isLogin ? this.loginForm.addControl('name', this.nameControl) : this.loginForm.removeControl('name') 
  }

  get name(): FormControl { return <FormControl>this.loginForm.get('name') }
  get email(): FormControl { return <FormControl>this.loginForm.get('email') }
  get password(): FormControl { return <FormControl>this.loginForm.get('password') }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
