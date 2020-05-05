import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Provides an end point for the user edit route
 */
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent {
  /**
   * Expose the username to template
   */
  public username = '';

  /**
   * On construction injects the needed services
   */
  constructor(private activatedRoute: ActivatedRoute) {
    // set username to value in route
    if (this.activatedRoute.snapshot.params.id) {
      this.username = this.activatedRoute.snapshot.params.id;
    }
  }

}
