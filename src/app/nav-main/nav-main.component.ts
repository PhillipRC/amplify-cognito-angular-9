import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
import { AmplifyService } from 'aws-amplify-angular';
import Auth from '@aws-amplify/auth';
import { from, Subscription } from 'rxjs';
import { AmplifyConfigurationService } from '../setup/amplify-configuration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-main',
  templateUrl: './nav-main.component.html',
  styleUrls: ['./nav-main.component.scss'],
})
export class NavMainComponent implements OnInit, OnDestroy {
  /**
   * Expose the envrionment to the template
   */
  public environment = environment;

  /**
   * expose the state to the template
   */
  public state: any;

  /**
   * expose the user data to the template
   */
  public currentAuthenticatedUserData: any | null = null;

  /**
   * reference to later unsubscribe
   */
  private amplifyServiceSubscription: Subscription | null = null;

  /**
   * reference to later unsubscribe
   */
  private currentAuthenticatedUserSubscription: Subscription | null = null;

  /**
   * On construction injects the needed services
   */
  constructor(private amplifyService: AmplifyService, public amplifyConfigurationService: AmplifyConfigurationService, private router: Router) { }

  /**
   * Handles when the component is first created
   */
  public ngOnInit(): void {
    // setup listener for auth state change
    this.amplifyServiceSubscription = this.amplifyService.authStateChange$.subscribe((authState) => {
      // save the returned state
      this.state = authState.state;
      // get the current user information
      this.currentAuthenticatedUserSubscription = from(Auth.currentAuthenticatedUser()).subscribe(
        data => {
          this.currentAuthenticatedUserData = data;
        },
        err => {
          this.currentAuthenticatedUserData = null;
        }
      );
    });
  }

  /**
   * Handle sign out
   */
  public signOut() {
    this.amplifyService.auth().signOut();
    // load signin screen
    this.router.navigate(['signin']);
  }

  /**
   * Handle when the component is destroyed
   */
  public ngOnDestroy(): void {
    if (this.amplifyServiceSubscription) {
      this.amplifyServiceSubscription.unsubscribe();
    }
    if (this.currentAuthenticatedUserSubscription) {
      this.currentAuthenticatedUserSubscription.unsubscribe();
    }
  }
}
