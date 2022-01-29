import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string;

  constructor(
    protected http: HttpClient,
    @Inject('childUrl') childUrl: string = ''
  ) {
    this.baseUrl = environment.apiUrl + childUrl + '/';
  }

  protected get<T>(url: string = ''): Observable<T> {
    return this.http.get<T>(this.baseUrl + url, { withCredentials: true });
  }

  protected post<T>(url: string = '', body: any): Observable<T> {
    return this.http.post<T>(this.baseUrl + url, body, {
      withCredentials: true,
    });
  }

  protected put<T>(url: string = '', body: any): Observable<T> {
    return this.http.put<T>(this.baseUrl + url, body, {
      withCredentials: true,
    });
  }

  protected patch<T>(url: string = '', body: any): Observable<T> {
    return this.http.patch<T>(this.baseUrl + url, body, {
      withCredentials: true,
    });
  }

  protected delete<T>(url: string = ''): Observable<T> {
    return this.http.delete<T>(this.baseUrl + url, { withCredentials: true });
  }
}
