/** 
 * The SynopsisCardComponent is used to render a mat dialog containing a synopsis of the movie selected.
 * @module SynopsisComponent
 */

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-synopsis-card',
  templateUrl: './synopsis-card.component.html',
  styleUrls: ['./synopsis-card.component.scss']
})
export class SynopsisCardComponent implements OnInit {

  /**
     * The data that was passed to the Synopsis dialog in the MovieCardComponent is injected in to the 
     * constructor using the MAT_DIALOG_DATA injection token. The data becomes a property on the class
     * and is hence available to be output in the template.
     */

  constructor(
    @Inject(MAT_DIALOG_DATA)

    public data: {
      Title: string,
      ImagePath: any,
      Description: string,
      Genre: string
    }
  ) { }

  ngOnInit(): void {
  }

}
