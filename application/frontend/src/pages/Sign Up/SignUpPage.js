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
import TermsValidation from "../../utils/signupValidation/TermsValidation";


function SignUpPage({type}) {

    //form states
    const [email, setEmail] = useState('')
    const [uname, setUname] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [redonePassword, setRedonePassword] = useState('');
    const[acceptTerms, setAcceptTerms] = useState(false);

    //form error states
    const [emailError, setEmailError] = useState('')
    const [unameError, setUnameError] = useState('')
    const [firstNameError, setFirstNameError] = useState('')
    const [lastNameError, setLastNameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [redonePasswordError, setRedonePasswordError] = useState('');
    const [termsError, setTermsError] = useState('');

    //Password Requirement states
    // const [lengthRequirementStyle, setLengthRequirementStyle] = useState('unmet');
    // const [capitalRequirementStyle, setCapitalRequirementStyle] = useState('unmet');
    // const [numberRequirementStyle, setNumberRequirementStyle] = useState('unmet');
    // const [characterRequirementStyle, setCharacterRequirementStyle] = useState('unmet');



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

    const history = useHistory();

    function onSubmitFunction(event){
        //Conditionals for personal vs business/shelter sign up
        type == 'personal' ? signUp(event) : onSubmitFunction = nextSignUpStep(event);
    }

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

    function nextSignUpStep(event) {
        event.preventDefault();

        let pathname
        type = 'business' ? pathname = '/business-signup2' : pathname = '/shelter-signup2'
        const signUpPage2 = {
            pathname: pathname,
            state: {email: email, username: uname, firstName: firstName, lastName: lastName, password: password, redonePassword: redonePassword}
        }

        const valid =validateForm();
        console.log('valid form: ', valid)

        if(valid){
            Axios.post('/api/sign-up/validate',{
                email: email,
                username: uname,
                password: password,
                redonePassword: redonePassword
            },{withCredentials: true})
            .then(response =>{
                history.push(signUpPage2);
            }).catch(error =>{
                if (error.response.data === "exists"){
                    setError("An Account using that Email or Username already exists");
                }
                else if (error.response.data === "passwords not matching"){
                    setError("The Passwords Entered Do Not Match");
                }
                else if (error.response.data === "password requirements"){
                    setError("Your Password Must Have: 8-50 Characters and Contain: 1 Capital Letter, 1 Number, 1 Special Character");
                }
            })
        }   
    }

    function validateForm(){
        console.log('First Name: ', firstName)
        console.log('Last Name: ', lastName)
        console.log('Email: ', email)
        console.log('uname: ', uname)
        console.log('Password: ', password)
        console.log('Redone Password: ', redonePassword)

        let fNameErr = NameValidation(true,firstName);
        let lNameErr = NameValidation(false, lastName);
        let unameErr = UsernameValidation(uname);
        let emailErr = EmailValidation(email);
        let passwordErr = PasswordValidation(password);
        let rPasswordErr = PasswordValidation(redonePassword);
        let termsErr = TermsValidation(acceptTerms);

        setFirstNameError(fNameErr);
        setLastNameError(lNameErr);
        setEmailError(emailErr);
        setUnameError(unameErr);
        setPasswordError(passwordErr);
        setRedonePasswordError(rPasswordErr);
        setTermsError(termsErr);

        if(fNameErr || lNameErr || emailErr || unameErr || passwordErr || rPasswordErr || termsErr){
            return false;
        }

        console.log('no errors');
        return true;
    }

    //Config of password requirements display when password input field state changes
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

    if(/[!()-.?\[\]_`~;:@#$%^&*+=]/.test(password)){
        characterRequirementStyle = 'met'
    }


    //Decide if password not matching message is displayed
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
            <form className={`${styles['signup-container']} ${'small-container'}`} onSubmit={(e) => onSubmitFunction(e)}>
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
                            className={styles.valid}
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
                        <span className={styles['termsError']}>{firstNameError}</span>
                    </div>

                    <div className={styles['lname-input-container']}>
                        <label className={styles['lname-input-label']} for='lname'>Last Name</label>

                        {!lastNameError ? 
                        <input
                            type='text'
                            placeholder='Last name'
                            name='lname'
                            onChange={e => setLastName(e.target.value)}
                            // pattern="[a-zA-Z]"
                            maxlength="40"
                            className={styles.valid}
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
                        <span className={styles['termsError']}>{lastNameError}</span>
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
                            className={styles.valid}
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
                        <span className={styles['termsError']}>{emailError}</span>
                    </div>

                    <div className={styles['username-input-container']}>
                        <label className={styles['username-input-label']} for='uname'>Username</label>
                        {!unameError ? 
                        <input
                            type='username'
                            placeholder='Enter username'
                            name='uname'
                            onChange={e => setUname(e.target.value)}
                            className={styles.valid}
                        /> :
                        <input
                            type='username'
                            placeholder='Enter username'
                            name='uname'
                            onChange={e => setUname(e.target.value)}
                            className={styles.invalid}
                        /> 
                        }
                        <span className={styles['termsError']}>{unameError}</span>
                    </div>

                    <div className={styles['password-input-container']}>
                        <label className={styles['password-input-label']} for='psw'>Password</label>
                        {!passwordError ? 
                        <input
                            type='password'
                            placeholder='Enter password'
                            name='psw'
                            onChange={e => setPassword(e.target.value)}
                            className={styles.valid}
                        /> :
                        <input
                            type='password'
                            placeholder='Enter password'
                            name='psw'
                            onChange={e => setPassword(e.target.value)}
                            className={styles.invalid}
                        />
                        }
                        <span className={styles['termsError']}>{passwordError}</span>
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
                            className={styles.valid}
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
                        <span className={styles['termsError']}>{redonePasswordError}</span>
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
                        <span className={styles['termsError']}>{termsError}</span>
                    </div>
                </div>
                {type == 'personal' && <button className={styles['submit-btn']} type='submit'>Sign Up</button>}
                {type == 'business' && <button className={styles['next-btn']} type='submit'>Next: Business Info</button>}
                {type == 'shelter' && <button className={styles['next-btn']} type='submit'>Next: Shelter Info</button>}
            </form>
            {/* Modals */}
            {type == 'personal' && 
                <>
                    <TermsAndConditions display={termsAndConditionsDisplay} onClose={closeTermsAndConditionsModal} />
                    <PrivacyPolicy display={privacyPolicyDisplay} onClose={closePrivacyPolicyModal} />
                </>
            }
        </>
    );
}

export default SignUpPage;