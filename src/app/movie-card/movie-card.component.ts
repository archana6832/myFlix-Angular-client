/** 
 * The MovieCardComponent is used to display the data retrieved from the movies collection of the
 * myFlix database. The data is looped through using the ngFor directive and each movie is rendered as
 * a mat card in the template. The cards display the title, director and an image of the movie and contain
 * buttons that can be opened to display dialogs with further information about the director or genre, 
 * or a synopsis. Movies can be added to or removed from favourites by clicking on a heart icon contained
 * in the top right corner of each card. The heart colour toggles accordingly to reflect the movie's status.
 * 
 * @module MovieCardComponent
 */

import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { DirectorCardComponent } from '../director-card/director-card.component';
import { SynopsisCardComponent } from '../synopsis-card/synopsis-card.component';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {


  /**
   * variables to store the movies
   *  Favorite Movies
   * and the genres
  */

  movies: any[] = [];
  genres: any[] = [];
  FavoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) { }


  ngOnInit(): void {
    this.getMovies();
  }


  /** 
   * Invokes the getAllMovies method on the fetchApiData service and populates the movies array with
   * the response. 
   */

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Opens a dialog to display the genre component, passing it the data it needs to display
   * genre information inside the data object.
   * @param name Name of the genre for the movie selected.
   * @param description Description of the genre.
   */

  openGenre(name: string, description: string): void {
    this.dialog.open(GenreDialogComponent, {
      data: {
        Name: name,
        Description: description
      },
      width: '500px',
    });
  }

  /**
  * Opens a dialog to display the director component, passing it the data it needs to display
  * information about the director inside the data object.
  * @param name Name of the director of the movie selected.
  * @param bio Biography of the director.
  * @param birth Year of birth of the director.
  * @param death Year of death of the director.
  */

  openDirector(name: string, bio: string, birth: string, death: string): void {
    this.dialog.open(DirectorCardComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth,
        Death: death
      },
      width: '500px',
    });
  }

  /**
   * Opens a dialog to display the synopsis component, passing it the data it needs to display a
   * synopsis of the movie within the data object.
   * @param title Title of the movie selected.
   * @param description Synopsis of the movie.
   */

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
   * Invokes the getUser method on the fetchApiData service and populates the favourites array with
   * the favouriteMovies property on the response, which is an array of the user's favourite movies. 
   */

  getFavoriteMovie(): void {
    const user = localStorage.getItem('user');
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.FavoriteMovies = resp.FavoriteMovies;
      console.log(this.FavoriteMovies);
    });
  }

  /**
     * Invokes the addFavoriteMovies method on the fetchApiData service, to add the movie to the user's
     * favourites. If successful, a popup is displayed confirming that the movie has been added. If 
     * unsuccessful, a popup message asks the user to try again.
     * @param movieID ID of the movie selected.
     * @param title Title of the movie selected.
     */

  addFavoriteMovie(MovieID: string, title: string): void {
    this.fetchApiData.addFavoriteMovies(MovieID).subscribe((resp: any) => {
      this.snackBar.open(`${title} has been added to your favorites!`, 'OK', {
        duration: 4000,
      });
      this.ngOnInit();
    });
    return this.getFavoriteMovie();
  }
  /**
    * Invokes the deleteMovie method on the fetchApiData service, to delete the movie from 
    * the user's favourites. If successful, a popup is displayed confirming that the movie has been
    * removed. If unsuccessful, a popup message asks the user to try again.
    * @param movieID 
    * @param title 
    */

  removeFavoriteMovie(MovieId: string, title: string): void {
    this.fetchApiData.deleteMovie(MovieId).subscribe((resp: any) => {
      console.log(resp);
      this.snackBar.open(
        `${title} has been removed from your favorites!`,
        'OK',
        {
          duration: 4000,
        }
      );
      this.ngOnInit();
    });
    return this.getFavoriteMovie();
  }

  /*
     check if the movie is the user's favorite?
   */
  isFavorite(MovieID: string): boolean {
    return this.FavoriteMovies.some((movie) => movie._id === MovieID);
  }

  /**
   * toggle add/remove user's favorite function.
 */
  toggleFavorite(movie: any): void {
    this.isFavorite(movie._id)
      ? this.removeFavoriteMovie(movie._id, movie.Title)
      : this.addFavoriteMovie(movie._id, movie.Title);
  }
}
