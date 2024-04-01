import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CategoryService } from './category.service';
import { Observable, Observer, Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

interface ItemData {
  categoryId: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  private getCategorySub!: Subscription;
  private postCategorySub!: Subscription;

  formData!: FormGroup;
  activeAddItem!: boolean;
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  listOfData: any[] = [];
  fileList: NzUploadFile[] = [];
  fileUploadedSpinner: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private message: NzMessageService
  ) {}
  ngOnInit(): void {
    this.updateEditCache();

    this.formData = this.fb.group({
      name: [null, Validators.required],
      img: [null, Validators.required],
    });
    this.getCategoryList();
  }
  ngOnDestroy(): void {
    if (this.getCategorySub) {
      this.getCategorySub.unsubscribe();
    }
    if (this.postCategorySub) {
      this.postCategorySub.unsubscribe();
    }
  }
  // ---------------Subcriptions------------------------

  getCategoryList(): void {
    this.getCategorySub = this.categoryService.getCategoryList().subscribe({
      next: (res) => {
        this.listOfData = res?.data;
      },
      error: (err) => {
        alert('Fetch error');
      },
    });
  }
  postCategory(data: any): void {
    // console.log(data);

    this.postCategorySub = this.categoryService.postCategory(data).subscribe({
      next: (res) => {
        this.message.create('success', res?.message);
        this.formData.reset();
        this.getCategoryList();
      },
      error: (err) => {
        alert('Fetch error');
      },
    });
  }

  // ---------------Add Item Code------------------------

  addItemSection(): void {
    this.activeAddItem = !this.activeAddItem;
    this.formData.reset();
  }
  addItem(): void {
    // console.log(this.formData.value);

    if (this.formData.valid) {
      this.postCategory({
        categoryName: this.formData.value.name,
        categoryImg: this.formData.value.img,
      });
    }
  }
  cancelAddItem(): void {
    this.activeAddItem = false;
  }

  // ---------------Edit Item Code------------------------
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex((item) => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false,
    };
  }

  saveEdit(id: string): void {
    const index = this.listOfData.findIndex((item) => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach((item) => {
      this.editCache[item.categoryId] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  // ---------------File Upload Code------------------------
  loading = false;
  avatarUrl?: string;
  beforeUpload = (
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.message.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.message.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    console.log(info.file!.originFileObj);
    const formData = new FormData();
    formData.set('avatar', info.file!.originFileObj);
    console.log(formData);

    this.getBase64(info.file!.originFileObj!, (img: string) => {
      this.loading = false;
      this.avatarUrl = img;
    });
  }

  // beforeUpload = (file: NzUploadFile): boolean => {
  //   this.fileUploadedSpinner = true;
  //   if (file.size !== undefined) {
  //     const fileSizeInMB = file.size / (1024 * 1024); // Convert size to MB

  //     // Clear previous images when a new image is uploaded
  //     this.fileList = [];

  //     if (fileSizeInMB > 3) {
  //       // Convert NzUploadFile to File
  //       const nativeFile = file as any;

  //       // Resize the image to 1MB before converting to base64
  //       this.resizeImage(nativeFile, 1, (resizedFile: File) => {
  //         this.fileList.push(resizedFile as any);
  //         this.convertIntoBase64();
  //         this.fileUploadedSpinner = false;
  //       });
  //     } else {
  //       this.fileList.push(file);
  //       this.convertIntoBase64();
  //       this.fileUploadedSpinner = false;
  //     }
  //     // console.log(this.fileList);
  //   } else {
  //     console.error('File size is undefined.');
  //   }

  //   return false;
  // };
  // convertIntoBase64() {
  //   if (this.fileList.length > 0) {
  //     const file = this.fileList[0];
  //     const blobFile: Blob | File = file as any;

  //     const reader = new FileReader();

  //     reader.onload = (event: any) => {
  //       const base64String = event.target.result;
  //       this.cdr.detectChanges();

  //       this.formData.patchValue({
  //         img: base64String,
  //       });
  //     };

  //     reader.readAsDataURL(blobFile);
  //   } else {
  //     console.log('No file selected.');
  //   }
  // }
  // resizeImage(
  //   file: File,
  //   targetSizeInMB: number,
  //   callback: (resizedFile: File) => void
  // ): void {
  //   const reader = new FileReader();

  //   reader.onload = (event: any) => {
  //     const img = new Image();
  //     img.src = event.target.result;

  //     img.onload = () => {
  //       const canvas = document.createElement('canvas');
  //       const ctx = canvas.getContext('2d')!;
  //       const maxWidth = 1024; // Adjust as needed
  //       const maxHeight = 1024; // Adjust as needed

  //       let width = img.width;
  //       let height = img.height;

  //       if (width > height) {
  //         if (width > maxWidth) {
  //           height *= maxWidth / width;
  //           width = maxWidth;
  //         }
  //       } else {
  //         if (height > maxHeight) {
  //           width *= maxHeight / height;
  //           height = maxHeight;
  //         }
  //       }

  //       canvas.width = width;
  //       canvas.height = height;

  //       ctx.drawImage(img, 0, 0, width, height);

  //       canvas.toBlob((blob) => {
  //         const resizedFile = new File([blob!], file.name, {
  //           type: 'image/jpeg',
  //         });
  //         callback(resizedFile);
  //       }, 'image/jpeg');
  //     };
  //   };

  //   reader.readAsDataURL(file);
  // }

  selectedFile!: File;
  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  onUpload() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    console.log(formData);

    this.categoryService.uploadFile(formData).subscribe(
      (response) => {
        console.log('File uploaded successfully', response);
      },
      (error) => {
        console.error('Error uploading file', error);
      }
    );
  }
}
