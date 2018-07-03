import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthanticated = false;
  private authListenerSubs: Subscription;
  public currentUserStudent = true;


  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthanticated => {
      this.userIsAuthanticated = isAuthanticated;
      this.currentUserStudent = this.authService.userType === 'student';

    });

  }

  onLogout() {
    this.authService.logout();
  }


  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
