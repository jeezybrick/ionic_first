import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../shared/models/user.model';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { finalize } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { FileItem, FileLikeObject, FileUploader } from 'ng2-file-upload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { FileUploaderOptions } from 'ng2-file-upload/file-upload/file-uploader.class';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  public uploader: FileUploader;
  public errors = null;
  public user: User;
  public profileForm: FormGroup;
  public isUserLoading = true;
  public attachmentAddingErrorMessage: string | null;
  public newUserAvatarObj: { file: File; url: SafeUrl | string; } | null = null;
  public maxFileSizeInMb: number = 5;

  private subs = new SubSink();
  private allowedMimeType = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif'
  ];

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private authService: AuthService,
              private loaderService: LoaderService,
              private toastService: ToastService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.getProfile();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  
  get userAvatarUrl(): SafeUrl | string {
    if (this.newUserAvatarObj) {
      return this.newUserAvatarObj.url;
    }

    if (!this.newUserAvatarObj) {
      return this.user.avatar;
    }
  }

  public reloadData(event): void {
    this.getProfile(event);
  }

  public logout(): void {
    this.authService.signOut();
    this.router.navigate(['/auth/login']);
  }

  public async onSubmit({value, invalid}: any) {
    if (invalid) {
      return;
    }

    const obs: Observable<any>[] = [];
    const formData = new FormData();
    formData.append('email', value.email);
    formData.append('fullname', value.fullname);

    if (this.newUserAvatarObj) {
      obs.push(this.authService.uploadAvatar(this.newUserAvatarObj.file));
    }

    this.errors = null;
    await this.loaderService.presentLoading();
    obs.push(this.authService.updateProfile(formData));

    this.subs.sink = forkJoin(obs)
        .pipe(
           finalize(() => this.loaderService.dismissLoading())
        )
        .subscribe((response: any) => {
              this.toastService.presentToast('Профіль успішно відредагований');
            },
            (error) => {
              this.toastService.presentErrorToast();
              this.errors = error;
            });
  }

  public onAvatarSelect(target): void {
    const file = target.files[0];

    if (file && file.size <= this.maxFileSizeInMb * 1024 * 1024) {
      this.newUserAvatarObj = {
        file,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file)),
      };
    }

  }

  private setProfileForm(): void {
    this.profileForm = this.fb.group({
      avatar: [undefined],
      fullname: [this.user.fullname, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: [this.user.email, [Validators.email, Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    });
  }

  private getProfile(event?): void {
    this.subs.sink = this.authService.me().subscribe((data: any) => {
      this.user = data.user;

      this.initUploader();
      this.setProfileForm();
      this.isUserLoading = false;

      if (event) {
        event.target.complete();
      }
    });
  }

  private initUploader(): void {
    this.uploader = new FileUploader(this.fileUploadOptions());

    this.uploader.onWhenAddingFileFailed = (item, filter, options) =>
        this.onWhenAddingAttachmentFailed(item, filter, options);

    this.uploader.onAfterAddingFile = (fileItem: FileItem) =>
        this.onAfterAddingAttachment(fileItem);

  }

  private onAfterAddingAttachment(fileItem: FileItem): void {
    fileItem.withCredentials = false;
    this.attachmentAddingErrorMessage = null;

    this.newUserAvatarObj = {
      file: fileItem._file,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(fileItem._file)),
    };
  }

  private onWhenAddingAttachmentFailed(
      item: FileLikeObject,
      filter: any,
      options: any
  ) {
    switch (filter.name) {
      case 'fileSize':
        this.attachmentAddingErrorMessage = `Maximum file upload size exceeded`;
        break;
      default:
        this.attachmentAddingErrorMessage = `Unknown error`;
    }

  }

  private fileUploadOptions(): FileUploaderOptions {
    return {
      autoUpload: true,
      maxFileSize: this.maxFileSizeInMb,
      allowedMimeType: this.allowedMimeType,
      url: `${environment.api}/api/users/${this.user._id}/upload-avatar`,
    };
  }


}
