import { useEffect, useState } from "react";
import Axios from "axios";
import styles from './SignUpPage.module.css';

import TermsAndConditions from '../../components/Modals/TermsAndConditions'
import PrivacyPolicy from '../../components/Modals/PrivacyPolicy'
import Input from '../../components/UI/Input/Input';
import { useHistory } from "react-router";

//Import Validation Functions
import NameValidation from '../../utils/signupValidation/NameValidation'
import EmailValidation from '../../utils/signupValidation/EmailValidation'
import UsernameValidation from '../../utils/signupValidation/UsernameValidation'
import PasswordValidation from '../../utils/signupValidation/PasswordValidation'


function SignUpPage() {

    //form states
    const [email, setEmail] = useState('')
    const [uname, setUname] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [redonePassword, setRedonePassword] = useState('');

    //form error states
    const [emailError, setEmailError] = useState('')
    const [unameError, setUnameError] = useState('')
    const [firstNameError, setFirstNameError] = useState('')
    const [lastNameError, setLastNameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [redonePasswordError, setRedonePasswordError] = useState('');

    //Password Requirement states
    // const [lengthRequirementStyle, setLengthRequirementStyle] = useState('unmet');
    // const [capitalRequirementStyle, setCapitalRequirementStyle] = useState('unmet');
    // const [numberRequirementStyle, setNumberRequirementStyle] = useState('unmet');
    // const [characterRequirementStyle, setCharacterRequirementStyle] = useState('unmet');

    const[acceptTerms, setAcceptTerms] = useState(false);

    const [termsAndConditionsDisplay, setTermsAndConditionsDisplay] = useState(false);
    const [privacyPolicyDisplay, setPrivacyPolicyDisplay] = useState(false);

    // const[passwordMatchStyle, setPasswordMatchStyle] = useState('same');

    const [passwordChecking, setPasswordChecking] = useState(false);


    function openTermsAndConditionsModal() {
        setTermsAndConditionsDisplay(true);
    }

    function closeTermsAndConditionsModal() {
        setTermsAndConditionsDisplay(false);
    }

    function openPrivacyPolicyModal() {
        setPrivacyPolicyDisplay(true);
    }

    function closePrivacyPolicyModal() {
        setPrivacyPolicyDisplay(false);
    }

    //states for sign up error display
    const [error, setError] = useState(null);

    const errorDisplay = error ? 
    <div className={styles['signup-error-container']}>
        {error}
    </div> : 
    <div className={styles['signup-requirements-container']}>
        Your Password Must Have at Least 8 Characters and Contain: 1 Capital Letter, 1 Number, 1 Special Character
    </div>;

    const history = useHistory();

    function signUp(event) {
        event.preventDefault();

        const valid =validateForm();
        console.log('valid form: ', valid)
        if(valid){
            Axios.post('/api/sign-up', {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    uname: uname,
                    password: password,
                    redonePassword: redonePassword
            },{withCredentials:true}).then(response => {
                if(response.data.affectedRows === 1){
                    history.push("/SignUpSuccess");
                }
 
            }).catch(error => {
                if (error.response.data === "exists"){
                    setError("An Account using that Email or Username already exists");
                    console.log(error);
                }
                else if (error.response.data === "passwords not matching"){
                    setError("The Passwords Entered Do Not Match");
                    console.log(error);
                }
                else if (error.response.data === "password requirements"){
                    setError("Your Password Must Have at least 8 Characters and Contain: 1 Capital Letter, 1 Number, 1 Special Character");
                    console.log(error);
                }
                console.log(error);
            })
        }
        else{
            console.log('invalid form')
        }
    }

    function validateForm(){
        console.log('First Name: ', firstName)
        console.log('Last Name: ', lastName)
        console.log('Email: ', email)
        console.log('uname: ', uname)
        console.log('Password: ', password)
        console.log('Redone Password: ', redonePassword)

        let fNameErr = NameValidation(firstName);
        let lNameErr = NameValidation(lastName);
        let unameErr = NameValidation(uname);
        let emailErr = NameValidation(email);
        let passwordErr = NameValidation(password);
        let rPasswordErr = NameValidation(redonePassword);

        setFirstNameError(fNameErr);
        setLastNameError(lNameErr);
        setEmailError(emailErr);
        setUnameError(unameErr);
        setPasswordError(passwordErr);
        setRedonePasswordError(rPasswordErr);

        if(fNameErr || lNameErr || emailErr || unameErr || passwordErr || rPasswordErr ){
            return false;
        }

        console.log('no errors');
        return true;
    }

    


    let lengthRequirementStyle = 'unmet';
    let capitalRequirementStyle = 'unmet';
    let numberRequirementStyle = 'unmet';
    let characterRequirementStyle = 'unmet';
    if(password.length >= 8){
        lengthRequirementStyle = 'met'
    }

    if(password.toLowerCase() != password){
        capitalRequirementStyle = 'met'
    }

    if(/[0-9]/.test(password)){
        numberRequirementStyle = 'met'
    }
    else{
        numberRequirementStyle = 'unmet'
    }

    let passwordMatchStyle = "same"
    if(passwordChecking  && password !== redonePassword){
        console.log('Password Checking on')
        if(redonePassword.length == 0 || password.length == 0){
            console.log('but password length is 0')
            passwordMatchStyle = "same"
            setPasswordChecking(false)
        }
        else{
            passwordMatchStyle = "differing"
        }
        
    }

    return (
        <>
            <form className={`${styles['signup-container']} ${'small-container'}`} onSubmit={signUp}>
                <div className={styles['signup-header']}>
                    <h1>Sign Up</h1>
                </div>
                <div className={styles['signup-fields-container']}>
                    <div className={styles['fname-input-container']}>
                        <label className={styles['fname-input-label']} for='fname'>First Name</label>
                        {!firstNameError ? 
                        <input
                            type='text'
                            placeholder='First name'
                            name='fname'
                            onChange={e => setFirstName(e.target.value)}
                            // pattern="[A-Za-z]"
                            maxlength="40"
                        /> : 
                        <input
                            type='text'
                            placeholder='First name'
                            name='fname'
                            onChange={e => setFirstName(e.target.value)}
                            // pattern="[A-Za-z]"
                            maxlength="40"
                            className={styles.invalid}
                        />}
                    </div>

                    <div className={styles['lname-input-container']}>
                        <label className={styles['lname-input-label']} for='lname'>Last Name</label>
                        {!firstNameError ? 
                        <input
                            type='text'
                            placeholder='Last name'
                            name='lname'
                            onChange={e => setLastName(e.target.value)}
                            // pattern="[a-zA-Z]"
                            maxlength="40"
                        /> :
                        <input
                            type='text'
                            placeholder='Last name'
                            name='lname'
                            onChange={e => setLastName(e.target.value)}
                            // pattern="[a-zA-Z]"
                            maxlength="40"
                            className={styles.invalid}
                        />
                        }
                    </div>

                    <div className={styles['email-input-container']}>
                        <label className={styles['email-input-label']} for='email'>Email</label>
                        {!emailError ? 
                        <input
                            type='email'
                            placeholder='Enter email'
                            name='email'
                            onChange={e => setEmail(e.target.value)}
                            maxlength="320"
                        /> :
                        <input
                            type='email'
                            placeholder='Enter email'
                            name='email'
                            onChange={e => setEmail(e.target.value)}
                            maxlength="320"
                            className={styles.invalid}
                        /> 

                        }
                    </div>

                    <div className={styles['username-input-container']}>
                        <label className={styles['username-input-label']} for='uname'>Username</label>
                        {!unameError ? 
                        <input
                            type='username'
                            placeholder='Enter username'
                            name='uname'
                            onChange={e => setUname(e.target.value)}
                        /> :
                        <input
                            type='username'
                            placeholder='Enter username'
                            name='uname'
                            onChange={e => setUname(e.target.value)}
                            className={styles.invalid}
                        /> 
                        }
                        
                    </div>

                    <div className={styles['password-input-container']}>
                        <label className={styles['password-input-label']} for='psw'>Password</label>
                        {!passwordError ? 
                        <input
                            type='password'
                            placeholder='Enter password'
                            name='psw'
                            onChange={e => setPassword(e.target.value)}
                        /> :
                        <input
                            type='password'
                            placeholder='Enter password'
                            name='psw'
                            onChange={e => setPassword(e.target.value)}
                            className={styles.invalid}
                        />
                        }
                    </div>
                    
                    <div className={styles['confirm-password-input-container']}>
                        <label className={styles['repeat-password-input-label']} for='psw-repeat'>Confirm Password</label>
                        {!redonePasswordError ? 
                        <input
                            type='password'
                            placeholder='Confirm password'
                            name='psw-repeat'
                            onChange={e => setRedonePassword(e.target.value)}
                            onBlur={() => setPasswordChecking(true)}
                        /> :
                        <input
                            type='password'
                            placeholder='Confirm password'
                            name='psw-repeat'
                            onChange={e => setRedonePassword(e.target.value)}
                            onBlur={() => setPasswordChecking(true)}
                            className={styles.invalid}
                        />
                        }
                    </div>
                    <ul className={styles['password-requirements-list']}>
                        <li className={styles[lengthRequirementStyle]}>At least 8 characters</li>
                        <li className={styles[capitalRequirementStyle]}>Contains a capital letter</li>
                        <li className={styles[numberRequirementStyle]}>Contains a number</li>
                        <li className={styles[characterRequirementStyle]}>Contains a special character</li>
                    </ul>
                    {passwordMatchStyle && <span className={styles[passwordMatchStyle]}></span>}
                    <div className={styles['checkbox-container']}>
                        <span>By creating an account you agree to our:</span>
                        <span>                        
                            <span className={styles['terms-button']} onClick={openTermsAndConditionsModal}> Terms </span> 
                            &
                            <span className={styles['policy-button']} onClick={openPrivacyPolicyModal}> Privacy Policy </span>
                            <input
                                type='checkbox' 
                                name='remember'
                                onChange={e => setAcceptTerms(e.target.checked)}
                            />
                        </span>
                    </div>

                </div>

                <button className={styles['submit-btn']} type='submit'>Sign Up</button>
                {errorDisplay}
            </form>
            {/* Modals */}
            <TermsAndConditions display={termsAndConditionsDisplay} onClose={closeTermsAndConditionsModal} />
            <PrivacyPolicy display={privacyPolicyDisplay} onClose={closePrivacyPolicyModal} />
        </>
    );
}

export default SignUpPage;