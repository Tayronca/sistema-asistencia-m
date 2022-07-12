import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-matrizr',
  templateUrl: './matrizr.component.html',
  styleUrls: ['./matrizr.component.css']
})
export class MatrizrComponent implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
  }

}
