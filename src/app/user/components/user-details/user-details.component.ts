import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  public userDetails: User;
  public isUserLoading: boolean = true;
  private subs = new SubSink();

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.subs.sink = this.userService.getUserDetails(this.route.snapshot.params.id).subscribe((userDetails) => {
      this.userDetails = userDetails;
      this.isUserLoading = false;
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
