import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  /**
   * Request GET
   */
  DataGet(path: any, payloads = {}) {
    return this.http.get(this.apiUrl + path, {
      params: payloads,
    }).pipe(timeout(30000), catchError((error) => {
      return error;
    }
    ));
  }

  /**
   * Request POST
   */
  DataPost(path: any, payloads = {}) {
    return this.http.post(this.apiUrl + path, payloads).pipe(timeout(30000), catchError((error) => {
      return error;
    }
    ));
  }

  /**
   * Request PUT
   */
  DataPut(path: any, payloads = {}) {
    return this.http.put(this.apiUrl + path, payloads).pipe(timeout(30000), catchError((error) => {
      return error;
    }
    ));
  }

  /**
   * Request DELETE
   */
  DataDelete(path: any, payloads = {}) {
    return this.http.delete(this.apiUrl + path, {
      params: payloads,
    }).pipe(timeout(30000), catchError((error) => {
      return error;
    }
    ));
  }
}