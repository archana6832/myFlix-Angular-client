/**
 * The FetchApiDataService is used to make Http requests to the myFlix Api to retrieve data on movies and
 * users that is used within the app, as well as to register and login users, update their details, and
 * to add or remove movies from their favourites. The class is marked with the Injectable decorator and
 * injected as a dependency to the root component, thereby making the service available to all the other
 * components.
 * @module FetchApiDataService
 */

// Used to provide the service as an injectable dependency to the root app
import { Injectable } from '@angular/core';

// Used to make Http requests to the Api
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';

// Requests return Observables (similar to Promises) 
import { Observable, throwError } from 'rxjs';



/**
 *Declaring the api url that will provide data for the client app
 */
const apiUrl = 'https://myflix-moviesapp.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {

  /**
    * Inject the HttpClient module to the constructor params
   This will provide HttpClient to the entire class, making it available via this.http
    * @param http 
    */
  constructor(private http: HttpClient) {
  }

  /**
    * call API end-point to register a new user
    * @function userRegistration
    * @param userDetails {any}
    * @returns a new user object
    */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }


  /**
  * call API end-point to log in a user
  * @param userDetails {any}
  * @returns user's data in json format
  */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }


  /**
   * call API end-point to get all movies
   * @function getAllMovies
   * @return array of movies object in json format
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * call API end-point to get a specific movie by Title
   * @function getMovie
   * @param title {any}
   * @returns a movie object in json format
   */
  getSingleMovie(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/:Title', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
    * call API end-point to get a director data by dirctor's name
    * @function getDirector
    * @param director {any}
    * @returns a director's data in json format
    */
  getDirector(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'directors/:Name', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * call API end-point to get a genre data
   * @function getGenre
   * @param genre {any}
   * @returns a genre data in json format
   */

  getGenre(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genres/:Name', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * call API end-point to get a user's informations
   * @param username {any}
   * @returns a user's information 
   */

  getUser(username: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
    * call API end-point to get a user's favorite movies list
    * @param username {any}
    * @returns a list of the user's favorite movies in json format
    */
  getFavoriteMovie(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/:Username/movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * call API end-point to add a movie to the user's favorite list
   * @param MovieId {any}
   * @returns the user's favorite list in json format
   */
  addFavoriteMovies(movieId: any): Observable<any> {
    const username = localStorage.getItem('user')
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'users/' + username + '/movies/' + movieId, null, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
 * call API end-point to delete a user's favorite movie
 * @param movieId {any}
 * @returns updated user's information after removed a movie from the list in json format
 */
  deleteMovie(movieId: any): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username + '/movies/' + movieId, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * call API end-point to edit the user's informations
   * @param username {any}
   * @param userData {any}
   * @returns updated user's information
   */
  editUser(userData: any): Observable<any> {
    const username = localStorage.getItem('user')
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + username, userData, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * call API end-point to delete the current user
   * @param username {any}
   * @returns delete status
   */
  deleteUser(): Observable<any> {
    const username = localStorage.getItem('user')
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


  /**
   * Non-typed response extracttion
   * @param res {any}
   * @returns response || empty object
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }


  /**
   * Handles error responses to Http requests.
   * @param error The HttpErrorReponse returned on the Observable's response stream.
   * @returns An observable that errors with the specified message.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(() => new Error(
      'Something bad happened; please try again later.'));
  }
}


