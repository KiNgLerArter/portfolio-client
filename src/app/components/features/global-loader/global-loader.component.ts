import { Component, OnInit } from '@angular/core';
import { GlobalLoaderService } from './service/global-loader.service';

@Component({
  selector: 'app-global-loader',
  templateUrl: './global-loader.component.html',
  styleUrls: ['./global-loader.component.scss'],
})
export class GlobalLoaderComponent implements OnInit {
  isLoading: boolean;

  constructor(private loaderService: GlobalLoaderService) {}

  ngOnInit(): void {
    this.loaderService.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }
}
