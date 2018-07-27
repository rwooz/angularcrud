import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
 
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
 
import { Student } from './student';
import { MessageService } from './message.service';
 
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable({ providedIn: 'root' })
export class StudentService {
 
  private studentsUrl = 'api/students';  // URL to web api
 
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
 
  /** GET heroes from the server */
  getStudents (): Observable<Student[]> {
    return this.http.get<Student[]>(this.studentsUrl)
      .pipe(
        tap(students => this.log(`fetched students`)),
        catchError(this.handleError('getStudents', []))
      );
  }
 
  /** GET hero by id. Return `undefined` when id not found */
  getStudentNo404<Data>(id: number): Observable<Student> {
    const url = `${this.studentsUrl}/?id=${id}`;
    return this.http.get<Student[]>(url)
      .pipe(
        map(students => students[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} student id=${id}`);
        }),
        catchError(this.handleError<Student>(`getStudent id=${id}`))
      );
  }
 
  /** GET hero by id. Will 404 if id not found */
  getStudent(id: number): Observable<Student> {
    const url = `${this.studentsUrl}/${id}`;
    return this.http.get<Student>(url).pipe(
      tap(_ => this.log(`fetched student id=${id}`)),
      catchError(this.handleError<Student>(`getStudent id=${id}`))
    );
  }
 
  /* GET heroes whose name contains search term */
  searchStudents(term: string): Observable<Student[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Student[]>(`${this.studentsUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found students matching "${term}"`)),
      catchError(this.handleError<Student[]>('searchStudents', []))
    );
  }
 
  //////// Save methods //////////
 
  /** POST: add a new hero to the server */
  addStudent (student: Student): Observable<Student> {
    return this.http.post<Student>(this.studentsUrl, student, httpOptions).pipe(
      tap((student: Student) => this.log(`added student w/ id=${student.id}`)),
      catchError(this.handleError<Student>('addStudent'))
    );
  }
 
  /** DELETE: delete the hero from the server */
  deleteStudent (student: Student | number): Observable<Student> {
    const id = typeof student === 'number' ? student : student.id;
    const url = `${this.studentsUrl}/${id}`;
 
    return this.http.delete<Student>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted student id=${id}`)),
      catchError(this.handleError<Student>('deleteStudent'))
    );
  }
 
  /** PUT: update the hero on the server */
  updateStudent (student: Student): Observable<any> {
    return this.http.put(this.studentsUrl, student, httpOptions).pipe(
      tap(_ => this.log(`updated student id=${student.id}`)),
      catchError(this.handleError<any>('updateStudent'))
    );
  }
 
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
 
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
 
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
 
  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('StudentService: ' + message);
  }
}