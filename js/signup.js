/**
 * This function signs up a user.
 */
async function signup() {
    document.getElementById('signup-button').disabled = true;
    await checkSignupValues();
    document.getElementById('signup-button').disabled = false;
}


/**
 * This function checks the entered values for sign-up and gives the user feedback.
 */
async function checkSignupValues() {
    let name = document.getElementById('signup-name-input').value;
    let email = document.getElementById('signup-email-input').value;
    let password = document.getElementById('signup-password-input').value;
    let passwordConfirm = document.getElementById('signup-password-confirm-input').value;
    if (password === passwordConfirm) {
        await loadUsers();
        await validateUser(name, email, password);
    } else {
        document.querySelector('#signup-password-confirm-input ~ p').classList.remove('display-none');
    }
}


/**
 * This function checks if the entered e-mail address already exists and registers the user if that is not the case.
 * If the e-mail address already exists, the function gives the user feedback.
 * 
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 */
async function validateUser(name, email, password) {
    let emailAlreadyExists = checkEmailForSignup(email);
    let color = getUserColor();
    let userObject = createUserObject(name, email, password, color);
    if (!emailAlreadyExists) {
        await resetUsersTasksContacts();
        useOfflineData();
        await signupUser(userObject);
        let phone = '';
        let newContact = createContactObject(name, email, phone, color);
        await loadContacts();
        contacts.push(newContact);
        storeContacts();
    }
}


/**
 * This function pushes the incoming object into the users array,
 * stores the users array and gives the user feedback that the user has signed up successfully.
 * 
 * @param {object} userObject 
 */
async function signupUser(userObject) {
    users.push(userObject);
    await storeUsers();
    showSuccessMessage();
    setTimeout(hideSuccessMessage, 1000);
}


/**
 * This function checks if the e-mail address already exists in the users array.
 * 
 * @param {string} email 
 * @returns {boolean} true if an e-mail address was found.
 */
function checkEmailForSignup(email) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].eMail === email.toLocaleLowerCase()) {
            document.querySelector('#signup-email-input ~ p').classList.remove('display-none');
            document.querySelector('#signup-password-confirm-input ~ p').classList.add('display-none');
            return true;
        }
    }
    return false;
}


/**
 * This function animates the success message for sign-up.
 */
function showSuccessMessage() {
    document.querySelector('body').style.position = 'relative';
    let overlay = document.getElementById('login-overlay');
    let message = document.querySelector('.signupSuccessMessage');
    overlay.classList.remove('animate-overlay');
    overlay.classList.add('signup-overlay');
    message.classList.add('signupSuccessMessageCenter');
}


/**
 * This function hides the success message for sign-up.
 */
function hideSuccessMessage() {
    let overlay = document.getElementById('login-overlay');
    let message = document.querySelector('.signupSuccessMessage');
    overlay.classList.remove('signup-overlay');
    message.classList.remove('signupSuccessMessageCenter');
    clearSignupField();
    openLogInMenu();
}


/**
 * This function creates a user object.
 * 
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} created based on user data.
 */
function createUserObject(name, email, password, color) {
    let firstName = getUserName('first', name);
    let lastName = getUserName('last', name);
    let id = getHighestUserId() + 1;
    return {
        firstName: firstName,
        lastName: lastName,
        id: id,
        color: color,
        password: `${password}`,
        eMail: `${email}`
    };
}


/**
 *  This function opens the login menu and hides the sign-up menu by adding and removing the class "display-none".
 */
function openLogInMenu() {
    document.getElementById('login-feld').classList.remove('display-none');
    document.getElementById('login-signup-box-footer').classList.remove('display-none');
    document.getElementById('login-signup-box-header').classList.remove('display-none');
    clearSignupField();
    closeSignupFailureMessages();
    document.getElementById('signup-feld').classList.add('display-none');
}


/**
 * This function clears the inputs in the sign-up fields.
 */
function clearSignupField() {
    document.getElementById('signup-name-input').value = '';
    document.getElementById('signup-email-input').value = '';
    document.getElementById('signup-password-input').value = '';
    document.getElementById('signup-password-confirm-input').value = '';
}


 /**
  * This function hides the failure messages in the sign-up field by adding the class "display-none".
  */
function closeSignupFailureMessages() {
    document.querySelector('#signup-email-input ~ p').classList.add('display-none');
    document.querySelector('#signup-password-confirm-input ~ p').classList.add('display-none');
}


/**
 * This function gets the first or last name(s) from the input
 * by cutting off whitespaces at the start and end of the string,
 * then it gets the used whitespace positions and saves them in an array.
 * 
 * @param {string} type 
 * @param {string} name 
 * @returns {Function} to get the user's name.
 */
function getUserName(type, name) {
    name = name.trim();
    let whitespaces = getWhitespaces(name);
    return getNameFromUnderThreeInputs(type, whitespaces, name);
}


/**
 * This function gets the user name by considering the used whitespaces under three used whitespaces.
 * 
 * @param {string} type 
 * @param {Array} whitespaces 
 * @param {string} name 
 * @returns {Function} to format user's name, or get user's name considering used whitespaces over three times.
 */
function getNameFromUnderThreeInputs(type, whitespaces, name) {
    if (whitespaces.length <= 1 && type === 'first') {
        return formatStringAsName(name);
    } else if (whitespaces.length <= 1 && type === 'last') {
        return ''
    } else if (whitespaces.length === 2 && type === 'first') {
        return formatStringAsName(name.slice(0, whitespaces[0]));
    } else if (whitespaces.length === 2 && type === 'last') {
        return formatStringAsName(name.slice(whitespaces[0] + 1, name.length));
    } else {
        return getNameFromOverThreeInputs(type, whitespaces, name);
    }
}


/**
 * This function gets the user name by considering the used whitespaces over three used whitespaces.
 * 
 * @param {string} type 
 * @param {Array} whitespaces 
 * @param {string} name 
 * @returns {string} the first or the last name.
 */
function getNameFromOverThreeInputs(type, whitespaces, name) {
    let firstName = '';
    let firstNames = [];
    let lastName = '';
    let results = getNamesThroughWhithspaces(whitespaces, name, firstNames, lastName);
    firstNames = results.firstNames;
    lastName = results.lastName;
    firstName = firstNames.toString().replace(',', ' ');
    if (type === 'first') {
        return firstName;
    } else if (type === 'last') {
        return lastName;
    }
}


/**
 * This function gets the user name by entering multiple first names.
 * 
 * @param {Array} whitespaces 
 * @param {string} name 
 * @param {string} firstNames 
 * @param {string} lastName 
 * @returns {Object} including the first names as an array and the last name as a string.
 */
function getNamesThroughWhithspaces(whitespaces, name, firstNames, lastName) {
    for (let i = 0; i < whitespaces.length; i++) {
        if (i === 0) {
            firstNames.push(formatStringAsName(name.slice(0, whitespaces[0])));
        } else if (i < whitespaces.length - 2) {
            firstNames.push(formatStringAsName(name.slice(whitespaces[i - 1] + 1, whitespaces[i] + 1)));
        } else if (i == whitespaces.length - 2) {
            firstNames.push(formatStringAsName(name.slice(whitespaces[i - 1] + 1, whitespaces[i])));
        } else {
            lastName += formatStringAsName(name.slice(whitespaces[i - 1] + 1, name.length));
        }
    }
    return {firstNames: firstNames, lastName: lastName};
}


/**
 * This function gets the necessary whitespaces.
 * 
 * @param {string} name 
 * @returns {Array} including the positions of the necessary whitespaces.
 */
function getWhitespaces(name) {
    let whitespaces = [];
    let whitespaceCounter = 0;
    do {
        let result = checkForWhitspaces(whitespaces, whitespaceCounter, name);
        whitespaces = result[0];
        whitespaceCounter = result[1];
    }
    while (whitespaces[whitespaces.length - 1] != -1);
    return whitespaces;
}


/**
 * This function checks if the current position is a necessary whitespace.
 * If it is a necessary position, the position will be pushed into the whitespaces array.
 * If it is not necessary, the whitespace counter will increase.
 * 
 * @param {Array} whitespaces 
 * @param {number} whitespaceCounter 
 * @param {string} name 
 * @returns {Array} including the whitespaces array and the whitespace counter number.
 */
function checkForWhitspaces(whitespaces, whitespaceCounter, name) {
    if (whitespaces.length === 0) {
        whitespaces.push(name.indexOf(' '));
    } else if (name[whitespaces[whitespaces.length - 1] + whitespaceCounter] != ' ') {
        whitespaces.push(name.indexOf(' ', whitespaces[whitespaces.length - 1] + 1 + whitespaceCounter));
        whitespaceCounter = 0;
    } else {
        whitespaceCounter++;
    }
    return [whitespaces, whitespaceCounter];
}


/**
 * This function formats the incoming string as a name.
 * 
 * @param {string} name 
 * @returns {string} the name with first character in upper case und the following characters in lower case.
 */
function formatStringAsName(name) {
    return name.trim().charAt(0).toLocaleUpperCase() + name.trim().slice(1, name.length).toLocaleLowerCase();
}


/**
 * This function determines the highest id of the user ids of the existing users.
 * @returns {number} highest id of a user in the users array.
 */
function getHighestUserId() {
    let userIds = users.map(user => user.id);
    let highestId = Math.max(...userIds);
    return highestId;
}