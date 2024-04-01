import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';

interface ItemData {
  id: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  formData!: FormGroup;

  listOfOption: string[] = [];
  // listOfSelectedValue: any[] = [];
  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder) {}

  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  listOfData: ItemData[] = [];

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
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  ngOnInit(): void {
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        id: `${i}`,
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
      });
    }
    this.listOfData = data;
    this.updateEditCache();

    const children: string[] = [];
    for (let i = 10; i < 36; i++) {
      children.push(`${i.toString(36)}${i}`);
    }
    this.listOfOption = children;

    // /////
    this.formData = this.fb.group({
      name: [null, Validators.required],
      price: [null, Validators.required],
      quantity: [null, Validators.required],
      code: [null, Validators.required],
      material: [null, Validators.required],
      weight: [null, Validators.required],
      width: [null, Validators.required],
      height: [null, Validators.required],
      description: [null, Validators.required],
      img: [null, Validators.required],
    });
  }
  // ----------
  activeAddItem!: boolean;
  addItemSection(): void {
    this.activeAddItem = !this.activeAddItem;
    this.formData.reset();
  }
  addItem(): void {
    console.log(this.formData.value);
  }
  cancelAddItem(): void {
    this.activeAddItem = false;
  }
  // -----------
  previewImage: string | undefined = '';
  previewVisible = false;

  fileList: NzUploadFile[] = [];
  // fileUploadedSpinner: boolean = false;
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
}
