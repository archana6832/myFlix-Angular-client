/** 
 * The EditProfileComponent is used to render a mat dialog containing a form where the
 * user can edit their profile details. 
 * @module EditProfileComponent
 */

import { Component, OnInit, Input } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})

export class EditProfileComponent implements OnInit {

  user: any = localStorage.getItem('user');

  /** 
   * userData values are populated by form inputs in the editprofile template
   */

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<EditProfileComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
     * Invokes the editUser method on the fetchApiData service, with the profileData from the form,
     * in order to update the user's details. A successful update closes the form and navigates the user
     * to the movies view. A popup is displayed confirming update success. If unsuccessful, a popup message
     * asks the user to check the form fields and try again.
     */

  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((res) => {
      this.dialogRef.close();
      window.location.reload();
      localStorage.setItem('user', res.Username)
      console.log(res)
      this.snackBar.open(this.user.Username, 'Successfully updated user details!', {
        duration: 3000
      });
    }, (res) => {
      this.snackBar.open('Try again', 'OK', {
        duration: 3000
      });
    })
  }
}
