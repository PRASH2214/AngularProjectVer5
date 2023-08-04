import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NotificationService } from './../../../services/notification.service'



import { MRProfileService } from '../../../services/mrprofile.service'
import { Router } from "@angular/router";
import { MasterService } from "../../../services/master";
import { StorageService } from "../../../services/storage.service";
import { CommonService } from "../../../services/common.service";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-profilepic',
  templateUrl: './profilepic.component.html',
  styleUrls: ['./profilepic.component.css']
})
export class MRProfilePicComponent implements OnInit {



  submitted = false;

  imageSrc: any;
  imagetype: any;
  imagename: any;
  constructor(
    public master: MasterService,
    private st: StorageService,
    private com: CommonService,
    private ads: MRProfileService,
    public Notification: NotificationService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {




  }

  Save() {


    if (this.imageSrc != null && this.imageSrc != undefined && this.imageSrc != "") {


      var jsondata = {
        "imagePath": this.imageSrc.split(',')[1],
        "fileName": this.imagename,
        "fileFlag": this.imagetype
      }

     
      this.spinner.show();
      this.ads.updateprofileimage(jsondata).subscribe((m) => {
        if (m.success == true && m.status == 1) {
          var changestorge = this.master.CurrentUser;
          changestorge.model.profileImagePath = m.message;
          this.master.CurrentUser = changestorge;
          this.st.add("listoken", changestorge);
          location.reload();
          this.Notification.showSuccess("Update successfully", "");
          this.spinner.hide();

        } else {
          this.spinner.hide();
          this.Notification.showError(m.message, "")
        }
      }, err => {
        this.spinner.hide();
        this.Notification.showError("something went wrong", "")

      })

    } else {

      this.spinner.hide();
      this.Notification.showError("Please select file", "")


    }

  }



  handleFileInput(e) {


    let file1 = e.target.files[0];


    if (file1.type == "image/png" || file1.type == "image/jpeg") {



      let fileName = file1.name;
      let filetype = file1.type;
      var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
      var pattern = /image-*/;
      var reader = new FileReader();
      this.imagename = fileName;
      this.imagetype = filetype;
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    } else {
      this.Notification.showError("Upload valid file format", "")

    }
  }
  _handleReaderLoaded(e) {

    let reader = e.target;
    this.imageSrc = reader.result;
  }

}
