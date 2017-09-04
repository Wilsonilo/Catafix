import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ViewController } from 'ionic-angular';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-newelement',
  templateUrl: 'newelement.html',
})
export class NewelementPage {

  captureDataUrl: string;

  constructor(public navCtrl: NavController, 
  	public navParams: NavParams, 
  	private camera: Camera, 
  	public alertCtrl: AlertController, 
  	public viewCtrl: ViewController,
  	public afModule: AngularFireModule,
  	public db: AngularFireDatabase,
  	private firebaseApp:FirebaseApp
  	) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewelementPage');
  }

  takePicture(){

  	//https://scotch.io/@shangyilim/take-photos-with-ionic-2-and-upload-via-firebase
  	const cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(cameraOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
      console.log("Error getting image: ", err);
    });

  }


  createBook(){

    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);

    // Get a reference to the storage service, which is used to create references in your storage bucket
	var storageRef = firebase.storage().ref();

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`images/${filename}.jpg`);

    imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
        console.log("Image Created, saving to stream...");

        //Save the image to stream and to user images array.
        var imgUrl 	= snapshot.downloadURL;
        var idImage = snapshot.ref
        var user	= 	firebase.auth().currentUser;
        var stream 	= this.db.list('/stream');
        stream.push({
        	bookid: idImage,
        	bookimg: imgUrl,
        	userid: user.uid
        });
        this.showSuccesfulUploadAlert();
    });

  }

  showSuccesfulUploadAlert() {
    let alert = this.alertCtrl.create({
      title: 'Created!',
      subTitle: 'Your book is on the stream, find to trade!',
      buttons: [{
      	text: 'OK',
      	handler: () => {
      		console.log("Success Alert launched and user clicked ok.")
      		this.cancel();
      	}
      }]
    });
    alert.present();

    // clear the previous photo data in the variable
    this.captureDataUrl = "";
  }

  cancel(){
   this.viewCtrl.dismiss();
  }

}
