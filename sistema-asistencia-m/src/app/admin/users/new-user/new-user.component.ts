import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  password:string= "";
  show:boolean= false;

  constructor() { }

  ngOnInit(): void {
  }

   generarPassword() { 
    var length = 6
    var result           = "";
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random()*charactersLength));
      }

    this.password = result
  }

  showPassword(){

    this.show = !this.show;
  }
 

}
