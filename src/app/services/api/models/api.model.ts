import { HttpRequest } from "@angular/common/http";

export interface ExtendedConfig extends Partial<HttpRequest<any>> {
  rootUrl?: string;
}
