import React, { Component } from 'react';
import firebase from '../../config/firebase';
import Preloader from '../Preloader/preloader';
import './login.css';

class Login extends Component {
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
                emailError = emailValid ? null : 'Email is required!';
                break;
            case 'password':
                passwordValid = value.length >= 1;
                passwordError = passwordValid? null : 'Password is required!';
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
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            window.location.href = '/';
        }).catch(() => {
            this.setState({formSubmitted: 'Fail: Wrong password or email!'});
        });
    }
    ifWrong = () => {
        if (this.state.formSubmitted === 'success') {
            return true;
        } else if (this.state.formSubmitted === 'Fail: Wrong password or email!') {
            return false;
        }
    }
    render() {
        return (
            <div className="center">
                <h2>Login</h2>
                <form method="post" onSubmit={this.handleSubmit} className="form-login">
                    <div className="inputs-group">
                        <input onChange={(event) => this.handleUserInput(event)} value={this.state.email} type="email" name="email" placeholder="Your email"></input>
                        <span>{this.state.emailError}</span>
                    </div>
                    <div className="inputs-group">
                        <input onChange={(event) => this.handleUserInput(event)} value={this.state.password} type="password" name="password" placeholder="Your password"></input>
                        <span>{this.state.passwordError}</span>
                    </div>
                    <button disabled={!this.state.formValid} type="submit" className="button button-primary">Log in</button>
                    {
                        this.ifWrong() ? <Preloader /> : <p className="error-message">{this.state.formSubmitted}</p>
                    }
                </form>
            </div>
        )
    }
}

export default Login;