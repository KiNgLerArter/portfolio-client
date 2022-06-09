import { HttpContext, HttpContextToken } from '@angular/common/http';

export const IS_LOADER = new HttpContextToken(() => true);

export const setLoader = (isLoader = true) =>
  new HttpContext().set(IS_LOADER, isLoader);
