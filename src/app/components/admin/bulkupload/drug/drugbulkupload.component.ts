import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NotificationService } from '../../../../services/notification.service'



import { BulkService } from '../../../../services/bulkupload.service'
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-drugbulkupload',
  templateUrl: './drugbulkupload.component.html',
  styleUrls: ['./drugbulkupload.component.css']
})
export class DrugBulkuploadComponent implements OnInit {

  headertext: string;
  type: string;
  submitted = false;

  imageSrc: any;
  imagetype: any;
  imagename: any;
  constructor(

    private _bulkService: BulkService,
    public Notification: NotificationService,
    public _route: ActivatedRoute
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




      ///////////////// Drug


      this._bulkService.drugbulkupload(jsondata).subscribe((m) => {
        if (m.success == true && m.status == 1) {

          this.Notification.showSuccess("Update successfully", "");


        } else {
          this.Notification.showError(m.message, "")
        }
      }, err => {

        this.Notification.showError("something went wrong", "")

      })



      ////////////



    } else {


      this.Notification.showError("Please select file", "")


    }

  }



  handleFileInput(e) {


    let file1 = e.target.files[0];



    let fileName = file1.name;
    let filetype = file1.type;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    this.imagename = fileName;
    this.imagetype = filetype;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {

    let reader = e.target;
    this.imageSrc = reader.result;
  }

}
