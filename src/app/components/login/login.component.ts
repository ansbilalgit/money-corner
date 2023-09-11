import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { GlobalService } from 'src/app/services/global.service';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  socialUser: SocialUser;
  loggedIn: boolean;

  lForm: FormGroup;
  user: any = {
    email: '',
    pwd: ''
  };
  hasFormErrors = {
    email: [],
    pwd: [],
    pageError: [],
    pageSuccess: []
  };

  constructor(fb: FormBuilder, public dataService: DataService,
    public globalService: GlobalService,
    private http: HttpClient, public router: Router,
    private authService: SocialAuthService
  ) {
    this.lForm = fb.group({
      'email': [this.user.email, Validators.required],
      'pwd': [this.user.pwd, Validators.required]
    });
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.loggedIn = (user != null);
      console.log(user);
      if(user != null) {
        const socialUser = {
          isUserVerified: true,
          name: user.name,
          email: user.email,
          mobile: '',
          createdon: '',
          photoUrl: user.photoUrl,
          pwd: '',
          repwd: ''
        }
        this.globalService.setUser(socialUser);
        this.dataService.updateUser(socialUser).subscribe(res => {
          if (res !== null) {
            this.hasFormErrors.pageSuccess = ['Success, Please verify email and login.'];
            this.router.navigateByUrl('/account');
            let self = this;
            setTimeout(function () {
              self.globalService.userLoggedIn.emit();
            }, 10);
          } else {
            this.hasFormErrors.pageError = ['Error, Please try again..!!'];
          }
        });
      }
    });
  }

  login(formData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.hasFormErrors.pageError = [];
    if (formData.email === '' || !(this.validateEmail(formData.email))) {
      this.hasFormErrors.email = ["Enter valid Email id!"];
      return;
    }
    this.hasFormErrors.email = [];
    if (formData.pwd === '') {
      this.hasFormErrors.pwd = ["Please enter password!"];
      return;
    }
    this.hasFormErrors.pwd = [];
    this.globalService.loaderState = true;
    this.http.post(this.globalService.rootPath + '?q=login', formData, httpOptions).pipe(take(1)).subscribe((res:any)=>{
      if (res !== null) {
            if(res.photoUrl == undefined) {
              res['photoUrl'] = '';
            }
            this.globalService.loaderState = false;
            this.globalService.setUser(res);
            this.router.navigateByUrl('/account');
          } else {
            this.hasFormErrors.pageError = ["Invalid login credentials"];
            this.globalService.loaderState = false;
          }
          this.globalService.userLoggedIn.emit();
    })
    // this.http.post(this.globalService.rootPath + '?q=login', formData, httpOptions).subscribe((res:any) => {
    //   debugger
    //   if (res !== null) {
    //     if(res.photoUrl == undefined) {
    //       res['photoUrl'] = '';
    //     }
    //     this.globalService.loaderState = false;
    //     this.globalService.setUser(res);
    //     this.router.navigateByUrl('/account');
    //   } else {
    //     this.hasFormErrors.pageError = ["Invalid login credentials"];
    //     this.globalService.loaderState = false;
    //   }
    //   this.globalService.userLoggedIn.emit();
    // });
  }

  public validateEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  refreshGoogleToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }
}
