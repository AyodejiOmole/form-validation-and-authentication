//Element Grabbers
const first = document.getElementById("first-name");
const last = document.getElementById("last-name");
const email = document.getElementById("email");
const firstPass = document.getElementById("first-password");
const secondPass = document.getElementById("second-password");
const form = document.getElementById("form-body");

// Database connection
const db = openDatabase("usersDB", "1.0", "Users", 99999);

// Form listener to handle submission of the form.
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const bool = validate();
    if(bool === true) {
        const suc = insertDetails();
        if(suc === true) {
            alert("Details inserted succesfully.");
        } else {
            alert("An error occured.");
        }
    }
});

// Validate if the user has filled all required fields.
function validate() {
    const firstName = first.value.trim();
    let lastName = last.value.trim();
    let Email = email.value.trim();
    let firstPassword = firstPass.value.trim();
    let secondPassword = secondPass.value.trim();

    let value = true;;
    if(firstName === '') {
        showError(first);
        value = false;
    } else {
        showSuccess(first);
    }

    if(lastName === '') {
        showError(last);
        value = false;
    } else {
        showSuccess(last);
    }

    if(Email === '') {
        showError(email);
        value = false;
    } else {
        showSuccess(email);
    }

    if(firstPassword === '') {
        showError(firstPass);
        value = false;
    } else {
        showSuccess(firstPass);
    }

    if(secondPassword === '') {
        showError(secondPass);
        value = false;
    } else {
        checkSamePassword(firstPassword, secondPassword);
    }

    return value;
}

//Checks if the user has entered the same values for the Password and Re-enter password fields.
function checkSamePassword(password1, password2) {
    if(!(password1 === password2)) {
        const parent = secondPass.parentElement;
        const small = parent.querySelector('small');
        small.innerHTML= "The passwords you have entered do not match.";

        const firstParent = firstPass.parentElement;
        const firstSmall = firstParent.querySelector('small');
        firstSmall.innerHTML= "The passwords you have entered do not match.";
        
        showError(secondPass);
        showError(firstPass);
    } else {
        showSuccess(secondPass);
    }
}

// Changes the class of the form inputs in order to properly reflect the error of the user.
function showError(input) {
    const parent = input.parentElement;
    parent.className = 'form-control error';
}

// Changes the class of the form inputs to denote successful filling of all the required fields in the form.
function showSuccess(input) {
    const parent = input.parentElement;
    parent.className = 'form-control success';
}

const create = document.getElementById("button-create");
create.addEventListener('click', () => {
    db.transaction(function(transaction) {
        const query = "CREATE TABLE users" + 
        "(ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," + 
        "first_name varchar(500)," + "last_name varchar(500)," + "email varchar(500)," + 
        "password varchar(500) NOT NULL)";

        transaction.executeSql(query, undefined, () => {
            alert("Table created succesfully.");
        }, (err) => {
            alert(err.message);
        });
    });
});

function insertDetails() {
    const firstName = first.value.trim();
    const lastName = last.value.trim();
    const Email = email.value.trim();
    const firstPassword = firstPass.value.trim();

    let success = true;

    db.transaction(function(transaction) {
        const query = "INSERT INTO users(first_name, last_name, email, password) VALUES (?, ?, ?, ?)";

        transaction.executeSql(query, [firstName, lastName, Email, firstPassword], ()=>{}, (err) => {
            alert(err.message);
            success = false;
        });
    });

    return success;
}