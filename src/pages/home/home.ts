import { Component } from '@angular/core';
import { NavController, ViewController, AlertController, ModalController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { NewelementPage } from '../pages'
import * as firebase from 'firebase/app';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user:any;
  constructor(public navCtrl: NavController, 
    private viewCtrl: ViewController, 
    public afAuth: AngularFireAuth, 
    private alertCtrl: AlertController,
    public modalCtrl: ModalController) {

    this.user = firebase.auth().currentUser;

  	if(!this.isLoggedIn()){
		this.navCtrl.popToRoot();
  	}

    console.log(firebase.storage().ref(), firebase.storage());

  }

  ionViewWillEnter() {
     this.viewCtrl.showBackButton(false);
  }

  isLoggedIn(){
    if(this.user !== null){
      console.log("user: ", this.user);
      return true
    } else {
      return false
    }
  }

  logout(){
    console.log("Loggin out.")
    this.afAuth.auth.signOut();
    this.navCtrl.popToRoot();
  }

  newElement(){
    let modal = this.modalCtrl.create(NewelementPage);
    modal.present();
  }

}