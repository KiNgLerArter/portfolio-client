import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class GlobalLoaderService {
  private _isLoading$ = new BehaviorSubject<boolean>(false);

  isLoading$ = this._isLoading$.asObservable();

  setLoading(isLoading: boolean): void {
    this._isLoading$.next(isLoading);
  }
}
