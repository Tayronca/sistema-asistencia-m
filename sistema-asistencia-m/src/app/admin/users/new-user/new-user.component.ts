import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  rol:string = 'superusuario';
  nombres:string = '';
  apellidos:string = '';
  cedula:string = '';
  correo:string = '';
  password:string= "";
  show:boolean= false;
  valid:boolean = true;

  constructor(
    private firestore:AngularFirestore,
    private auth:AngularFireAuth,
    private router:Router
  ) { 
   
  }

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

  saveUser(){

    const{rol,nombres,apellidos,cedula,correo,password} = this
    if(rol && nombres&&apellidos&&cedula&&correo&&password){
      this.valid = true
      const auth = this.auth;

      auth.createUserWithEmailAndPassword(correo,password).then(result=>{

          if(result.user){

              result.user.sendEmailVerification();
              
              var user ={
                rol:this.rol,
                nombres:this.nombres,
                apellidos:this.apellidos,
                cedula:this.cedula,
                correo:this.correo,
                emailVerified:false,
                uid:result.user.uid,
                photoURL:''
              }
          
              this.firestore.collection('users').doc(user.uid).set(user).then(e=>{

                this.clearInput()

                this.router.navigate(['admin/users'])
              })

          }

      })

     
    }else{

      this.valid = false
    }
  }

  clearInput(){
    this.password = ''
    this.nombres = ''
    this.apellidos = ''
    this.correo = ''
    this.cedula = ''
  }
 

}
