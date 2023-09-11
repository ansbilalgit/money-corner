import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  newUserForm: FormGroup;
  user: any = {
    name: '',
    email: '',
    pwd: '',
    repwd: '',
    mobile: ''
  };
  hasFormErrors = {
    name: [],
    email: [],
    pwd: [],
    pageError: [],
    pageSuccess: []
  };

  constructor(fb: FormBuilder, public dataService: DataService,
    public globalService: GlobalService, public router: Router) {
    this.newUserForm = fb.group({
      'name': [this.user.name, Validators.required],
      'email': [this.user.email, Validators.required],
      'pwd': [this.user.pwd, Validators.required],
      'repwd': [this.user.pwd, Validators.required],
      'mobile': [this.user.mobile, Validators.required]
    });
  }

  ngOnInit() {
    if(this.globalService.currUser.isUserVerified) {
      this.router.navigateByUrl('/account');
    }
  }

  addNewUser(formData) {
    if (formData.name === '') {
      this.hasFormErrors.name = ["Enter your name!"];
      return;
    }
    this.hasFormErrors.name = [];
    if (formData.email === '' || !(this.validateEmail(formData.email))) {
      this.hasFormErrors.email = ["Enter valid Email id!"];
      return;
    }
    this.hasFormErrors.email = [];
    if (formData.pwd != formData.repwd) {
      this.hasFormErrors.pwd = ["Passwords didn't match!"];
      this.newUserForm.patchValue({
        repwd: '',
      });
      return;
    }
    this.hasFormErrors.pwd = [];
    this.globalService.loaderState = true;
    this.hasFormErrors.pageSuccess = [];
    this.hasFormErrors.pageError = [];
    this.dataService.updateUser(formData).subscribe(res => {
      if (res !== null) {
        this.hasFormErrors.pageSuccess = ['Success, Please verify email and login.'];
        let self = this;
        setTimeout(function () {
          self.router.navigateByUrl('/account');
        }, 10);
      } else {
        this.hasFormErrors.pageError = ['Error, Please try again..!!'];
      }
      this.globalService.loaderState = false;
    });
  }

  public validateEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }
}
