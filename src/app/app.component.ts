import { Component, OnInit, ElementRef, Renderer, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import { User } from './user';

function emailMatcher(c: AbstractControl): {[key: string]: boolean} | null {
  let emailControl = c.get('email');
  let confirmControl = c.get('confirmEmail');

  if (emailControl.pristine || confirmControl.pristine) {
    return null;
  }
  if (emailControl.value === confirmControl.value) {

    return null;
  }
  if (emailControl.valid  && (confirmControl.dirty && confirmControl.value === '')){
    let answer: {[key: string]: boolean} = {'emptyInput': true};
    return answer;
  }

  console.log('match: ' + true);
  return { 'match': true };
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private validationMessages = {
    required: 'Please enter your email address',
    pattern: 'Please enter a valid email address',
    match: 'Confirmation email does not match email address'
  };

  private confirmationValidationMessages = {
    required: 'Please enter your email address',
    pattern: 'Please enter a valid email address',
    match: 'Confirmation email does not match your email address',
    emptyInput: 'Please enter a confirmation email'
  };

  user: User = new User();
  emailMessage: string;
  confirmationMessage: string;

  signupForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      emailGroup: this.fb.group({
            email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
            confirmEmail: ['', Validators.required],
      }, {validator: emailMatcher}),
    password: ['', Validators.required]
    });
    console.log(this.confirmationMessage);
    const emailControl = this.signupForm.get('emailGroup.email');
    const confirmControl = this.signupForm.get('emailGroup.confirmEmail');
    const emailGroupControl = this.signupForm.get('emailGroup');
    emailControl.valueChanges.subscribe(value => 
      
      this.setMessage(emailControl)
    
    );
    confirmControl.valueChanges.subscribe(value => 
      this.setConfirmationMessage(emailGroupControl, confirmControl)
    );
  }

  setMessage(b: AbstractControl): void {
    this.emailMessage = '';
    console.log('errors: ' + JSON.stringify(b.errors));

    if((b.touched || b.dirty) && b.errors) {
      this.emailMessage = Object.keys(b.errors)
        .map(key => this.validationMessages[key]).join(' ');

      console.log('setMessage ln70 : ' + this.emailMessage);
    }

  }

  setConfirmationMessage(emailGroupControl: AbstractControl, confirmControl: AbstractControl): void {
    this.confirmationMessage = '';
    
    // if confirmEmail input is touched and dirty 
    // while confirmEmail and emailGroup has errors,
    // then post errors to page
    if ((confirmControl.touched || confirmControl.dirty) && 
    (emailGroupControl.errors) || confirmControl.errors) {
      this.confirmationMessage = Object.keys(emailGroupControl.errors)
        .map(key => this.confirmationValidationMessages[key])
                    .join(' ');
                    console.log("WAAAAAXXXUUP");
                    console.log(this.confirmationMessage);

    }
    if (emailGroupControl.errors && confirmControl.value === '') {
        this.confirmationMessage = this.confirmationValidationMessages['emptyInput'];
    }
    console.log('setMessage ln92 : ' + this.confirmationMessage);
  }
}