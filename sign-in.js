// import {db} from './index';

const submit = document.getElementById("form-body");
const email = document.getElementById("email-sign");
const password = document.getElementById("password-sign");

const db = openDatabase("usersDB", "1.0", "Users", 99999);

submit.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const value = validate();
    if(value === true) {
        authenticateLogin();
    } 
    

    // Array Destructuring
    const [val1, ...val2] = [23, 45, 56, 67];
    console.log(val1, val2);
});

function validate() {
    const passwordValue = password.value.trim();
    const emailValue = email.value.trim();
    let value = true;

    if(passwordValue === '') {
        showError(password);
        value = false;
    }

    if(emailValue === '') {
        showError(email);
        value = false; 
        
    } 

    return value;
}

function showError(input) {
    const parent = input.parentElement;
    parent.className = 'form-control error';
}

function authenticateLogin() {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    let retrievedPassword;
    
    db.transaction(function(transaction) {
        const query = "SELECT * FROM users WHERE email = ? ";

        transaction.executeSql(query, [emailValue], (transaction, results) => {
            const len = results.rows.length;

            if(len === 0) {
                showWrongEmail();
            } else {
                const rows = results.rows.item(0);
                retrievedPassword = rows.password;
                const value = compare(passwordValue, retrievedPassword);
                if(value) {
                    alert("Correct Password");
                } else {
                    alert("Incorrect Password!");
                    alert(retrievedPassword);
                }
            }
        }, (err) => {
            alert(err.message);
        });
    });
}

function compare(enteredValue, gottenValue) {
    if(enteredValue === gottenValue) {
        return true;
    } else {
        return false;
    }
}

function showWrongEmail() {
    const parent = email.parentElement;
    const small = parent.querySelector('small');
    small.innerText = "This email you have entered is wrong."

    parent.className = 'form-control error';
}

