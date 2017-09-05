import { Component } from '@angular/core';
import { NavController, ViewController, AlertController, ModalController, PopoverController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { NewelementPage, ProfilePage } from '../pages'
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { TradePopOverPage } from '../pages'
import * as firebase from 'firebase/app';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user:any;
  stream:FirebaseListObservable<any>;
  tradesOfUser = [];
  streamSubscription;
  constructor(public navCtrl: NavController, 
    private viewCtrl: ViewController, 
    public afAuth: AngularFireAuth, 
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public db: AngularFireDatabase,
    public popoverCtrl: PopoverController
    ) {

    this.user = firebase.auth().currentUser;

  	if(!this.isLoggedIn()){
		  this.navCtrl.popToRoot();
  	}

    this.fetchInfo()
  }

  ionViewWillEnter() {
     this.viewCtrl.showBackButton(false);
  }

  fetchInfo(){
    console.log("Fetch info called.")
    this.tradesOfUser = [];
    //Streams
    this.stream = this.db.list('/stream', {
      query: {
        preserveSnapshot: true
      }
    });

    this.streamSubscription = this.stream.subscribe(response => {
        response.forEach(element => {
          if(element.trades !== undefined){
            if(element.trades[this.user.uid]){
              console.log("This element nows trade with user: ", element.trades[this.user.uid]);
              this.tradesOfUser.push(element.trades[this.user.uid]['forBook'])
            }
          }
        });
     });
  }

  isLoggedIn(){
    if(this.user !== null){
      return true
    } else {
      return false
    }
  }

  logout(){
    console.log("Loggin out.")
    this.streamSubscription.unsubscribe();
    // this.afAuth.auth.signOut().then(() =>{
    //    this.navCtrl.pop();
    // });
    this.afAuth.auth.signOut();
    this.navCtrl.popToRoot();
  }

  newElement(){
    let modal = this.modalCtrl.create(NewelementPage);
    modal.present();
  }

  profile(){
    let modal = this.modalCtrl.create(ProfilePage); // Need to pass information to avoid double fetch on modal.
    modal.present();
  }

  tradeWithUser(bookid, booktitle){
    
    //Present Popover
    console.log(this.tradesOfUser);
    let modal = this.modalCtrl.create(TradePopOverPage, { bookid: bookid, user: this.user, stream: this.stream, tradesofuser: this.tradesOfUser, booktitle:  booktitle});
    
    modal.present();

    //Reload on dismiss
    modal.onDidDismiss((data) => {
      console.log(data);
      //Reload for now, need to work it better later on to check the data.
      this.fetchInfo();
    })

  }


  checkIfTraded(idbook:string){

    var index = this.tradesOfUser.indexOf(idbook);
    if(index >= 0){
      return false
    }
    return true;
  }
}