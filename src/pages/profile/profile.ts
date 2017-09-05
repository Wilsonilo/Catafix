import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ViewController } from 'ionic-angular';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user:any;
  userelements:FirebaseListObservable<any>;
  usertrades = [];
  counter:number;
  userinfo: string = "own"; // Default Segment selected

  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,  
  	public afAuth: AngularFireAuth,
  	public viewCtrl: ViewController,
  	public db: AngularFireDatabase) {
  	this.user = firebase.auth().currentUser;
  	this.fetchUserItems();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  fetchUserItems(){

  	this.userelements = this.db.list('/stream', {
	  query: {
	  	orderByChild: 'userid',
	    equalTo: this.user.uid,
	    preserveSnapshot: true
	  }
	});
    this.userelements.subscribe(response => {
        response.forEach(element => {
          if(element.trades !== undefined){
            var arrayTrades = [element.trades];
            arrayTrades.forEach(element => {
              for (var prop in element) {
                this.usertrades.push(prop);
              }
            })
          }
        });
     });

  	//Work counter for some stuff.
  	//Need to publish to be able to subscribe, do later.
  	// this.userelements.forEach(items => {
  	// 	console.log(items);
  	// 	this.counter += 1;
  	// });

  }

  removeElement(elementid){
  	if(elementid !== undefined){

  		var checkElement = this.db.list('/stream/'+elementid);
  		checkElement.subscribe(response =>{
  			var userObjectInfo = response[4];

  			if(userObjectInfo.$value === this.user.uid){
  				console.log("This user is owner of this book, can delete");
  				this.db.object('/stream/'+elementid).remove()
  				.then(_ => console.log('Element removed'))
  				.catch(err => console.log(err, 'You dont have access!'));

  				//Need to incorporate later on a remove from storage based onf the imgname / id
  			}

  		});
  		
  	}
  }

  closeModal(){
  	this.viewCtrl.dismiss();
  }

}
