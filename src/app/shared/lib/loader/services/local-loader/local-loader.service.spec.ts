import { TestBed } from "@angular/core/testing";

import { LocalLoaderService } from "./local-loader.service";

describe("LocalLoaderService", () => {
  let service: LocalLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalLoaderService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
