import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  userInfo = {
    name: "",
    email: "",
    phno: "",
    msg: ""
  }
  btnMsg = "Submit";
  infoMsg = "";
  showInfoBlock = true;
  btnState = false;
  contactSub: Subscription;
  constructor(fb: FormBuilder, public dataService: DataService) {
    this.contactForm = fb.group({
      'name': [this.userInfo.name, Validators.required],
      'email': [this.userInfo.email, Validators.required],
      'phno': [this.userInfo.phno, Validators.required],
      'msg': [this.userInfo.msg, Validators.required]
    });
  }

  ngOnInit() {
  }

  sendInfo(formData) {
    if (formData.name == "" || formData.email == "" || formData.msg == "") {
      this.infoMsg = "Please enter your details";
      this.showInfoBlock = true;
      return;
    } else {
      this.infoMsg = "";
      this.showInfoBlock = false;
    }

    this.btnMsg = "Please wait...";
    this.btnState = true;

    this.contactSub = this.dataService.contactUser(formData).subscribe(res => {
      this.showInfoBlock = true;
      this.btnState = false;
      this.btnMsg = "Submit";
      if (res !== null) {
        this.infoMsg = "Successfully submitted, Will reach out out to you soon.";
        this.contactForm.controls['name'].setValue('');
        this.contactForm.controls['email'].setValue('');
        this.contactForm.controls['phno'].setValue('');
        this.contactForm.controls['msg'].setValue('');
      } else {
        this.infoMsg = "Something wrong try after some time";
      }
    });
  }

  ngOnDestroy() {
    if (this.contactSub) {
      this.contactSub.unsubscribe();
    }
  }

}
