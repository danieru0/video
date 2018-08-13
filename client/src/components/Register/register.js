import React, { Component } from 'react';
import Preloader from '../Preloader/preloader';
import './register.css';

class Register extends Component {
    constructor (props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            emailError: null,
            passwordError: null,
            emailValid: false,
            passwordValid: false,
            formValid: false,
            formSubmitted: null
        }
    }
    handleUserInput = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value}, () => {
            this.validateField(name, value);
        });
    }
    validateField = (fieldName, value) => {
        let emailValid = this.state.emailValid,
            passwordValid = this.state.passwordValid,
            emailError = this.state.emailError,
            passwordError = this.state.passwordError;
        switch(fieldName) {
            case 'email':
                emailValid = value.length >= 1;
                emailError = emailValid ? null : 'Email is important!';
                break;
            case 'password':
                passwordValid = value.length >= 1;
                passwordError = passwordValid? null : 'Password is important!';
                break; 
            default:
                break;
        }
        this.setState({
            emailValid: emailValid,
            passwordValid: passwordValid,
            emailError: emailError,
            passwordError: passwordError
        }, this.validateForm);
    }
    validateForm = () => {
        this.setState({
            formValid: this.state.emailValid && this.state.passwordValid
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({formSubmitted: 'success'});
        fetch('/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "email": this.state.email,
                "password": this.state.password
            }),
        }).then(res => res.json())
          .then(res => {
                if (res === 'success') {
                    window.location.href = '/';
                } else if (res === 'error') {
                    console.log('error');
                    this.setState({formSubmitted: 'Fail: Email is taken!'});
                }
        });
    }
    ifWrong = () => {
        if (this.state.formSubmitted === 'success') {
            return true;
        } else if (this.state.formSubmitted === 'Fail: Email is taken!') {
            return false;
        }
    }
    render() {
        return (
            <div className="center">
                <h2>Register</h2>
                <form method="post" onSubmit={this.handleSubmit} className="form-login">
                    <div className="inputs-group">
                        <input onChange={(event) => this.handleUserInput(event)} value={this.state.email} type="email" name="email" placeholder="Your login"></input>
                        <span>{this.state.emailError}</span>
                    </div>
                    <div className="inputs-group">
                        <input onChange={(event) => this.handleUserInput(event)} value={this.state.password} type="password" name="password" placeholder="Your password"></input>
                        <span>{this.state.passwordError}</span>
                    </div>
                    <button disabled={!this.state.formValid} type="submit" className="button button-primary">Register</button>
                    {
                        this.ifWrong() ? <Preloader /> : <p className="error-message">{this.state.formSubmitted}</p>
                    }
                </form>
            </div>
        )
    }
}

export default Register;