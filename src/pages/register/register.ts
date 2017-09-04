import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../pages'
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

	username:string;
	password:string;
	passwordrepeat:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register(){

  	if(this.username === undefined || this.password === undefined || this.passwordrepeat === undefined){
  		let alert = this.alertCtrl.create({
      		title: 'All Fields are neccesary',
      		subTitle: 'Please fill username (email) and passwords',
      		buttons: ['OK']
    	});
    	alert.present();
  	} else {

  		//Check if passwords are the same
  		if(this.password !== this.passwordrepeat){

  			let alert = this.alertCtrl.create({
	      		title: 'Passwords are not equal',
	      		subTitle: 'Retype your passwords and check that they are equal.',
	      		buttons: ['OK']
	    	});
	    	alert.present();

  		} else {

  			//Register user and catch for errors.
  			this.afAuth.auth.createUserWithEmailAndPassword(this.username, this.password).then(response => {

  				//Save information in localstorage.
  				console.log("User registered success.", response);
  				this.navCtrl.push(HomePage);

  			}).catch(error => {

  				let alert = this.alertCtrl.create({
		      		title: 'Error',
		      		subTitle: error.message,
		      		buttons: ['OK']
		    	});
		    	alert.present();

  			})
  		}

  	}

  }

}
