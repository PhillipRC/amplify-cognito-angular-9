import { Component } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';

/**
 * Display a loader
 */
@Component({
  selector: 'app-loader-component',
  templateUrl: './loader-component.component.html',
  styleUrls: ['./loader-component.component.scss'],
  animations: [
    // delayed fade-in for loader
    fadeInOnEnterAnimation({
      anchor: 'loaderAnimation',
      duration: 1000,
      delay: 500
    })
  ]
})
export class LoaderComponentComponent { }
