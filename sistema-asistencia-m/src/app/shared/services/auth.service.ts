import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(async (user) => {

      if (user) {
         this.userData = await this.getDataUser(user);

         if(this.userData){
          await localStorage.setItem('user', JSON.stringify(this.userData));
          await JSON.parse(localStorage.getItem('user')!);
          await this.router.navigate(['admin']);
         }

      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then( (result) => {
        this.ngZone.run(() => {
          this.router.navigate(['admin']);
        });

        var user = result.user

        if(user){
          
           this.getDataUser(user)

        }

       

       
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);

     return user !== null && user.emailVerified !== false ? true : false;
  }

  SetUserData(user: any,singUser:any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );


    const userData: User = {
      uid: user.uid,
      correo: user.correo,
      nombres: user.nombres,
      apellidos: user.apellidos,
      cedula: user.cedula,
      rol: user.rol,
      photoURL: user.photoURL,
      emailVerified: singUser.emailVerified
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }


  async getDataUser(u:any){

   
    var data = this.afs.firestore.collection('users').doc(u.uid).get()



   const user= await data.then(e=>{
              if(e.exists){

              

                return e.data()
              }
              return null
          })

    await this.SetUserData(user,u);

    return user

  }

  
}