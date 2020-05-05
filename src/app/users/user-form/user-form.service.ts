import { Injectable } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

/**
 * Defines the form modes
 */
export enum UserFormMode {
  create = 0,
  edit = 1,
  readonly = 2
}

@Injectable({
  providedIn: 'root'
})
export class UserFormService {

  /**
   * Default values
   */
  private defaults = {
    email: '',
    Username: ''
  };

  /**
   * Set mode
   */
  public mode: UserFormMode = UserFormMode.create;

  /**
   * Form definition
   */
  public form: FormGroup = new FormBuilder().group({
    email: new FormControl(this.defaults.email, [
      Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/),
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(2048)
    ]),
    Username: new FormControl(this.defaults.Username, [
      Validators.pattern(/^\S*$/),
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(128)
    ]),
    sub: new FormControl(''),
    UserCreatedDate: new FormControl('')
  });

  /**
   * Helper to find value in array of objects
   */
  private findValue(key: string, data: Array<any>) {
    const found = data.find(element => element.Name === key);
    if (found) {
      return found.Value;
    } else {
      return '';
    }
  }

  /**
   * Set form data from CognitoUser
   */
  public set(data: any) {
    this.form.setValue(
      {
        Username: data.Username,
        UserCreatedDate: data.UserCreateDate,
        email: this.findValue('email', data.UserAttributes),
        sub: this.findValue('sub', data.UserAttributes)
      }
    );

  }

  /**
   * Restore the form to default values
   */
  public reset() {
    this.form.reset(this.defaults);
  }

  constructor() { }

}
