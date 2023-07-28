import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public myForm!:FormGroup;

  constructor(private fb:FormBuilder,private router: Router){}

  ngOnInit(): void {
    this.myForm = this.createMyForm();
  }

  private createMyForm():FormGroup{
  return this.fb.group({
    email:[],
    password:[]
    });
  }

  public submitForm(){
    if(this.myForm.invalid){
        return;
    }
    const { email, password } = this.myForm.value;
    if (email === 'administrador@correo.com' && password === '1234') {
      alert('Inicio de sesión exitoso');
      this.router.navigate(['/dashboard']);
    } else {
      alert('Credenciales incorrectas. Intentelo nuevamente.');
    }
  }
}
