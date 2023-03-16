import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

import { ExtendedConfig } from "../models/api.model";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private baseUrl: string;

  constructor(protected http: HttpClient, @Inject("rootUrl") rootUrl = "") {
    this.baseUrl = this.generateUrl(rootUrl);
  }

  protected get<T>(
    url = "",
    { rootUrl, context }: ExtendedConfig = {}
  ): Observable<T> {
    return this.http.get<T>(
      this.generateUrl(rootUrl, url) ?? this.baseUrl + url,
      {
        withCredentials: true,
        context
      }
    );
  }

  protected post<T>(
    url = "",
    { rootUrl, context, body }: ExtendedConfig = {}
  ): Observable<T> {
    return this.http.post<T>(
      this.generateUrl(rootUrl, url) ?? this.baseUrl + url,
      body,
      {
        withCredentials: true,
        context
      }
    );
  }

  protected put<T>(
    url = "",
    { rootUrl, context, body }: ExtendedConfig = {}
  ): Observable<T> {
    return this.http.put<T>(
      this.generateUrl(rootUrl, url) ?? this.baseUrl + url,
      body,
      {
        withCredentials: true,
        context
      }
    );
  }

  protected patch<T>(
    url = "",
    { rootUrl, context, body }: ExtendedConfig = {}
  ): Observable<T> {
    return this.http.patch<T>(
      this.generateUrl(rootUrl, url) ?? this.baseUrl + url,
      body,
      {
        withCredentials: true,
        context
      }
    );
  }

  protected delete<T>(
    url = "",
    { rootUrl, context }: ExtendedConfig = {}
  ): Observable<T> {
    return this.http.delete<T>(
      this.generateUrl(rootUrl, url) ?? this.baseUrl + url,
      {
        withCredentials: true,
        context
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

      resultUrl += currUrl + "/";
    }

    return resultUrl;
  }
}
