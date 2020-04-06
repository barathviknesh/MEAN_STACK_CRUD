import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { EmployeeService } from '../shared/employee.service';
import { Employee } from '../shared/employee.model';

declare var M: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  providers: [EmployeeService]
})
export class EmployeeComponent implements OnInit {

  _id=''
  name=''
  position=''
  office=''
  salary=<number><unknown>''


  constructor(public employeeService: EmployeeService) { }

  employeeForm1 : FormGroup;

  ngOnInit() {
    this.resetForm();
    this.refreshEmployeeList();

    this.employeeForm1 = new FormGroup({

      _id: new FormControl(''),
      name: new FormControl(''),
      position: new FormControl(''),
      office: new FormControl(''),
      salary: new FormControl('')

    })
  }

  resetForm(form?: FormGroup) {
    if (form)
      form.reset();
    this.employeeService.selectedEmployee = {
      _id: "",
      name: "",
      position: "",
      office: "",
      salary: null
    }
  }

  onSubmit(form: FormGroup) {

    this.employeeService.selectedEmployee._id = form.value._id
    this.employeeService.selectedEmployee.name = form.value.name
    this.employeeService.selectedEmployee.position = form.value.position
    this.employeeService.selectedEmployee.office = form.value.office
    this.employeeService.selectedEmployee.salary = form.value.salary


    if (form.value._id == "") {
      this.employeeService.postEmployee(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshEmployeeList();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
      });
    }
    else {
      this.employeeService.putEmployee(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshEmployeeList();
        M.toast({ html: 'Updated successfully', classes: 'rounded' });
      });
    }
  }

  refreshEmployeeList() {
    this.employeeService.getEmployeeList().subscribe((res) => {
      this.employeeService.employees = res as Employee[];
    });
  }

  onEdit(emp: Employee, form: FormGroup) {
    console.log('Edit Selected');
    this.employeeForm1.controls.name.setValue(emp.name)
    this.employeeForm1.controls._id.setValue(emp._id)
    this.employeeForm1.controls.position.setValue(emp.position)
    this.employeeForm1.controls.office.setValue(emp.office)
    this.employeeForm1.controls.salary.setValue(emp.salary)
  }

  onDelete(_id: string, form: FormGroup) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.employeeService.deleteEmployee(_id).subscribe((res) => {
        this.refreshEmployeeList();
        this.resetForm(form);
        M.toast({ html: 'Deleted successfully', classes: 'rounded' });
      });
    }
  }

}
