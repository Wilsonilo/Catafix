import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewelementPage } from './newelement';

@NgModule({
  declarations: [
    NewelementPage,
  ],
  imports: [
    IonicPageModule.forChild(NewelementPage),
  ],
})
export class NewelementPageModule {}
