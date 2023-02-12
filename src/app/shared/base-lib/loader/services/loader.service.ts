import { BehaviorSubject } from "rxjs";

export class LoaderService {
  private _isLoading$ = new BehaviorSubject<boolean>(false);

  isLoading$ = this._isLoading$.asObservable();

  setLoading(isLoading: boolean): void {
    this._isLoading$.next(isLoading);
  }
}
