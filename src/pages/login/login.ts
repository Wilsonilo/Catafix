import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, AlertController } from 'ionic-angular';
import { HomePage, RegisterPage } from '../pages'
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	username:string;
	password:string;

  constructor(public navCtrl: NavController, private viewCtrl: ViewController, public afAuth: AngularFireAuth, private alertCtrl: AlertController) {

  	if(this.isLoggedIn()){
  		this.navCtrl.push(HomePage);
  	}

  }

  // Lifecycle
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {
     this.viewCtrl.showBackButton(false);
     this.username = "";
     this.password = "";
     this.afAuth.auth.signOut();
  }

  //Handler
  isLoggedIn(){
    var user = firebase.auth().currentUser;
  	if(user !== null){
  		return true
  	} else {
  		return false
  	}
  }

  logIn(){

  	if(this.username !== "" && this.password !== ""){
      this.afAuth.auth.signInWithEmailAndPassword(this.username, this.password).then(response => {

        if(this.isLoggedIn()){
          this.navCtrl.push(HomePage);
        }

      }).catch(error =>{

        let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: error.message,
              buttons: ['OK']
          });
          alert.present();

      });

  	}
  	
  }

  register(){

  	this.navCtrl.push(RegisterPage);
  }

}
