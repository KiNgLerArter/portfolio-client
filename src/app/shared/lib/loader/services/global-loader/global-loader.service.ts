import { Injectable } from "@angular/core";
import { LoaderService } from "@shared/base-lib/loader";

@Injectable({
  providedIn: "root"
})
export class GlobalLoaderService extends LoaderService {}
