import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ViewController } from 'ionic-angular';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-trade-pop-over',
  templateUrl: 'trade-pop-over.html',
})
export class TradePopOverPage {
  user:any;
  bookid:string;
  booktitle:string;
  userbook:string;
  tradesOfUser = [];
  stream:FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, public viewCtrl: ViewController,
) {
  	this.user 			= this.navParams.data.user;
  	this.stream 		= this.navParams.data.stream;
    this.bookid      = this.navParams.data.bookid;
    this.booktitle      = this.navParams.data.booktitle;
  	this.tradesOfUser 	= this.navParams.data.tradesofuser;
  	//console.log(this.tradesOfUser);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad TradePopOverPage');
  } 
  //(ionSelect)="radioChecked()"
  // radioChecked(){

  // 	console.log(this.userbook);
  // }
  confirmTrade(bookId, bookTitle, bookimg, bookDescription){
  	//Remove or append to trade on book
  	//var check = this.db.object('/stream/'+this.userbook+'/trades/'+this.user.uid);
    var check = firebase.database().ref('/stream/' + this.bookid +'/trades/'+ this.user.uid).once('value').then(snapshot => {
	  
	  if(snapshot.val() !== null){

  			//Remove
  			firebase.database().ref('/stream/' + this.bookid +'/trades/'+ this.user.uid).remove().then(response => {
  				console.log("Trade Removed ");
  				this.tradesOfUser.splice(bookId, 1);
  			})

  			
  		} else {

  			//Append
  			firebase.database().ref('/stream/' + this.bookid +'/trades/'+ this.user.uid).set({
          forBook: bookId,
          forBookTitle: this.booktitle,
  				bookTitle: bookTitle,
  				bookImg: bookimg,
  				bookDescription: bookDescription,
  				userEmail: this.user.email
  			}).then(response => {
  				console.log("Traded");
  			})

  		}

	});


  }

  closeModal(){
  	this.viewCtrl.dismiss(this.tradesOfUser);
  }

  notTraded(bookId){
  	//console.log(bookId)
  	var index = this.tradesOfUser.indexOf(bookId);
    //console.log(index);
    if(index >= 0){
      return true
    }
    return false;
  }
}
