/** 
 * The UserRegistrationFormComponent is used to render a mat dialog containing a form where the
 * user can complete and submit a profile to register for myFlix. 
 * @module UserRegistrationFormComponent
 */

import { Component, OnInit, Input } from '@angular/core';
// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})


export class UserRegistrationFormComponent implements OnInit {

  /** 
   * userData values are populated by form inputs in the user-registration-form template that are 
   * bound using the ngModel directive.
   */

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };
  /** 
     * Passing classes as parameters to the constructor sets them as properties on the component class 
     * that can then be accessed as needed.
     */

  constructor(
    public fetchApiData: FetchApiDataService,
    // Creates a reference to the dialog that contains the UserRegistrationForm component
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar

  ) { }


  ngOnInit(): void {
  }

  /**
   * Invokes the userRegistration method on the fetchApiData service, with the userData from the form,
   * in order to register the user. Successful registration closes the form and a popup is displayed 
   * inviting the user to log in. If unsuccessful, a popup message will ask the user to try again with a 
   * different username.
   */

  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
      // Logic for a successful user registration 
      this.dialogRef.close(); // This will close the modal on success!
      console.log(result);
      this.snackBar.open(this.userData.Username, 'User Registration successful.Please logIn', {
        duration: 4000
      });
    }, (result) => {
      this.snackBar.open('Try again', 'OK', {
        duration: 4000
      });
    });
  }

}
