/** 
 * The ProfileViewComponent is used to render a mat card displaying the user's profile details. This includes
 * two action buttons to edit their profile and deregister from the application, respectively.
 * @module ProfileComponent
 */

import { Component, OnInit, Input } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// Used to navigate the user back to the welcome page on successful deregistration
import { Router } from '@angular/router';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { FetchApiDataService } from '../fetch-api-data.service';
import { SynopsisCardComponent } from '../synopsis-card/synopsis-card.component';


@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {

  user: any = localStorage.getItem('user');
  password: any = localStorage.getItem('password');
  favorited: any[] = []
  favoritedTitle: any = []
  movies: any[] = []

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' }

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) { }

  /**
   * Calls the getUser method as soon as the component loads so that the data can be used to populate
   * the template.
   */

  ngOnInit(): void {
    this.getUser()
    this.getFavorites()
    this.getMovies()
  }

  /** 
  * Invokes the getUser method on the fetchApiData service and populates the user object with
  * the response. 
  */

  getUser(): void {
    const user = localStorage.getItem('user')
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.user = resp
      return this.user
    })
    console.log(this.user);
  }

  /**
   * Opens a dialog containing the editProfile component that renders the edit profile form.
   */

  openEditProfile(): void {
    this.dialog.open(EditProfileComponent, {
      width: '500px'
    });
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);//all movies
      return this.movies;
    });
  }

  /**
   * @function getAllMovies Retrieves the logged in user's favorited movies
   * @returns filterFavorites() function which filters the favorited movies
   */

  getFavorites(): void {
    const user = localStorage.getItem('user');
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.favorited = resp.FavoriteMovies;
      console.log(this.favorited);//favorite movies(may be same movie multiple times)
      return this.filterFavorites();
    });
  }

  /**
 * Filters the logged in user's favorited movies against all movies
 * @returns the favoritedTitle state which includes the titles of all favorited movies
 */

  filterFavorites(): void {
    this.movies.forEach((movie: any) => {
      if (this.favorited.includes(movie._id)) {
        this.favoritedTitle.push(movie);
      }
    });
    console.log(this.favoritedTitle);//(favorite movies)
    return this.favoritedTitle;
  }

  /**
 * use API end-point to remove user favorite
 * @function deleteMovie
 * @param MovieId{string}
 * @returns updated user's data in json format
 */

  removeFavorite(id: string): void {
    this.fetchApiData.deleteMovie(id).subscribe((resp: any) => {
      this.snackBar.open(`movie deleted`, 'OK', {
        duration: 2000
      });
      location.reload();
    })
  }
  openSynopsis(title: string, imagePath: any, description: string): void {
    this.dialog.open(SynopsisCardComponent, {
      data: {
        Title: title,
        ImagePath: imagePath,
        Description: description,
      },
      width: '500px'
    });
  }
  /** 
   * Invokes the deleteUser method on the fetchApiData service to deregister the user. If deregistration
   * is successful the local storage is cleared, a popup confirms that the profile has been removed and
   * the user is routed back to the welcome page. 
   */

  deleteProfile(): void {
    const user = localStorage.getItem('user');
    this.fetchApiData.deleteUser().subscribe((res: any) => {
      this.snackBar.open(`User profile has been deleted`, 'OK', {
        duration: 2000
      });
    });
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}



