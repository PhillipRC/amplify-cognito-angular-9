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
    username: ''
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
    username: new FormControl(this.defaults.username, [
      Validators.pattern(/^\S*$/),
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(128)
    ]),

  });

  /**
   * Restore the form to default values
   */
  public reset() {
    this.form.reset(this.defaults);
  }

  constructor() { }

}
