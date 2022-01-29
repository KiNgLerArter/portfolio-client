import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalLoaderService {
  private _isLoading$ = new BehaviorSubject<boolean>(false);

  set isLoading(loading: boolean) {
    this._isLoading$.next(loading);
  }

  get isLoading(): boolean {
    return this._isLoading$.value;
  }

  get isLoading$(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  constructor() {}
}
