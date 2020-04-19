import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-nav-main',
  templateUrl: './nav-main.component.html',
  styleUrls: ['./nav-main.component.scss'],
})
export class NavMainComponent {
  /**
   * Expose the envrionment to the template
   */
  public environment = environment;
}
