import { Component, OnInit } from '@angular/core';
import { observable } from 'rxjs';

import { AuthService } from "../shared/services/auth.service";
import { User } from '../shared/services/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(
    public authService: AuthService,
  ) { 
    
  }

  ngOnInit(): void {
   
  }

}
