import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  employeeForm: FormGroup = new FormGroup({});
  employeeObj: EmployeeModel = new EmployeeModel();
  employeeList: EmployeeModel[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.createForm();
    this.loadEmployeeData();
  }

  reset(){
    this.employeeObj = new EmployeeModel();
   this.createForm()
  }

  // Create the form with initial values
  createForm() {
    this.employeeForm = new FormGroup({
      empId: new FormControl(this.employeeObj.empId),
      name: new FormControl(this.employeeObj.name,[Validators.required]),
      city: new FormControl(this.employeeObj.city),
      address: new FormControl(this.employeeObj.address),
      contactNo: new FormControl(this.employeeObj.contactNo),
      emailId: new FormControl(this.employeeObj.emailId),
      pincode: new FormControl(this.employeeObj.pincode, [Validators.required ,Validators.minLength(6)]),
      state: new FormControl(this.employeeObj.state)
    });
  }

  // Load employee data from localStorage
  loadEmployeeData() {
    if (isPlatformBrowser(this.platformId)) {
      const oldData = localStorage.getItem('EmpData');
      if (oldData !== null) {
        this.employeeList = JSON.parse(oldData);
      }
    }
  }

  // Save employee data
  onSave() {
    if (isPlatformBrowser(this.platformId)) {
      const newEmployee = this.employeeForm.value;

      // Generate a new empId
      if (this.employeeList.length > 0) {
        newEmployee.empId = this.employeeList.length + 1;
      } else {
        newEmployee.empId = 1;
      }

      // Add the new employee to the list
      this.employeeList.unshift(newEmployee);

      // Save the updated list to localStorage
      localStorage.setItem('EmpData', JSON.stringify(this.employeeList));
      this.reset();
    }
  }
  
  onEdit(item: EmployeeModel){
    this.employeeObj = item;
    this.createForm()
  }

  onUpdate(){
   const record = this.employeeList.find(m=>m.empId == this.employeeForm.controls['empId'].value);
   if (record != undefined) {
    record.address = this.employeeForm.controls['address'].value
    record.name = this.employeeForm.controls['name'].value
    record.contactNo = this.employeeForm.controls['contactNo'].value
   } 
   localStorage.setItem('EmpData', JSON.stringify(this.employeeList));
   this.reset();
  }


  onDelete(id : number){
    const isDelete = confirm('Are you sure you want to delete this employee');
    if(isDelete){
      const index = this.employeeList.findIndex(m=>m.empId == id);
      this.employeeList.splice(index, 1);
      localStorage.setItem('EmpData', JSON.stringify(this.employeeList));
    }
  }

}

// Define EmployeeModel class in the same file
export class EmployeeModel {
  empId: number;
  name: string;
  city: string;
  state: string;
  emailId: string;
  contactNo: string;
  address: string;
  pincode: string;

  constructor() {
    this.empId = 1;
    this.name = "";
    this.city = "";
    this.state = "";
    this.emailId = "";
    this.contactNo = "";
    this.address = "";
    this.pincode = "";
  }
}