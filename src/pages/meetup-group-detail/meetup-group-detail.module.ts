import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeetupGroupDetailPage } from './meetup-group-detail';
import { ShareModule } from "../../components/share.module";

@NgModule({
  declarations: [
    MeetupGroupDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MeetupGroupDetailPage),
    ShareModule
  ],
  exports: [
    MeetupGroupDetailPage
  ]
})
export class MeetupGroupDetailPageModule {}
