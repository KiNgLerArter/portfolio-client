import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdditionalConfig } from './@types/api.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string;

  constructor(
    protected http: HttpClient,
    @Inject('rootUrl') rootUrl: string = ''
  ) {
    this.baseUrl = this.generateUrl(rootUrl);
  }

  protected get<T>(
    url = '',
    { rootUrl }: AdditionalConfig = {}
  ): Observable<T> {
    return this.http.get<T>(
      this.generateUrl(rootUrl, url) ?? this.baseUrl + url,
      {
        withCredentials: true,
      }
    );
  }

  protected post<T>(
    url = '',
    body: any,
    { rootUrl }: AdditionalConfig = {}
  ): Observable<T> {
    return this.http.post<T>(
      this.generateUrl(rootUrl, url) ?? this.baseUrl + url,
      body,
      {
        withCredentials: true,
      }
    );
  }

  protected put<T>(
    url = '',
    body: any,
    { rootUrl }: AdditionalConfig = {}
  ): Observable<T> {
    return this.http.put<T>(
      this.generateUrl(rootUrl, url) ?? this.baseUrl + url,
      body,
      {
        withCredentials: true,
      }
    );
  }

  protected patch<T>(
    url = '',
    body: any,
    { rootUrl }: AdditionalConfig = {}
  ): Observable<T> {
    return this.http.patch<T>(
      this.generateUrl(rootUrl, url) ?? this.baseUrl + url,
      body,
      {
        withCredentials: true,
      }
    );
  }

  protected delete<T>(
    url = '',
    { rootUrl }: AdditionalConfig = {}
  ): Observable<T> {
    return this.http.delete<T>(
      this.generateUrl(rootUrl, url) ?? this.baseUrl + url,
      {
        withCredentials: true,
      }
    );
  }

  private generateUrl(...urls: string[]): string {
    let resultUrl = environment.apiUrl;

    for (let i = 0; i < urls.length; i++) {
      const currUrl = urls[i];
      if (!currUrl?.length) {
        return null;
      }

      resultUrl += currUrl + '/';
    }

    return resultUrl;
  }
}
