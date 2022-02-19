
/** 
 * The UserLoginFormComponent is used to render a mat dialog containing a form where the
 * user can submit their credentials to log in to myFlix.
 * @module UserLoginFormComponent
 */

import { Component, OnInit, Input } from '@angular/core';
// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

  /** 
  * userData values are populated by form inputs in the user-login-form template that are bound 
  * using the ngModel directive.
  */

  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }


  /**
   * Invokes the loginUser method on the fetchApiData service, with the loginData from the form,
   * in order to log in the user. A successful login closes the form and navigates the user to the
   * movies route. A popup is displayed confirming login success. If unsuccessful, a popup message
   * asks the user to check their username and password.
   */

  ngOnInit(): void {
  }
  // This is the function responsible for sending the form inputs to the backend
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      // Logic for a successful user login
      this.dialogRef.close(); // This will close the modal on success!

      /**
      * The user's username and token returned from the database are stored in local storage so that 
      * they can be used for subsequent requests to fetch movies, get a user's profile etc. Password
      * is set using the userData so that an unhashed version can be used when displaying the user's
      * profile in the profile view (the database returns the hashed version).
      */

      localStorage.setItem('password', this.userData.Password);
      localStorage.setItem('user', result.user.Username);
      localStorage.setItem('token', result.token);
      console.log(result);
      this.snackBar.open(result.user.Username, 'Login successful', {
        duration: 4000
      });
      this.router.navigate(['movies']);
    }, (result) => {
      this.snackBar.open('No such user.Try again', 'OK', {
        duration: 4000
      });
    });
  }
}
