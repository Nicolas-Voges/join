/**
 * This function initializes the contacts page by calling init() and rendering all contacts.
 */
async function initContacts() {
    checkForLogin();
    await init();
    await Promise.all([loadUsers(), loadTasks(), loadContacts()]);
    renderContacts();
}


/**
 * This function searches for a user with the same e-mail address as the contact and returns the user's color if there is a match or returns the contact's color if there is none.
 * @param {Object} contact 
 * @returns {string} desired contact color
 */
function getContactColor(contact) {
    let foundUser = users.find(user => user.eMail === contact.eMail);
    if (foundUser) {
        return foundUser.color;
    } else {
        return contact.color;
    }
}


/**
 * This function renders the first letter of the first name of a contact if the letter has not been rendered yet.
 * @param {Object} contact 
 * @param {Array} renderedLetters letters that have already been rendered
 */
function renderLetterIfItHasNotBeenRendered(contact, renderedLetters) {
    let contactList = document.getElementById('contact-list');
    let letter = contact.firstName.charAt(0);
    if (renderedLetters.find(renderedLetter => renderedLetter === letter) === undefined) {
        contactList.innerHTML += contactLetterTemplate(letter);
        renderedLetters.push(letter);
    }
}


/**
 * This function renders the contact list.
 */
function renderContacts() {
    let contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';
    let renderedLetters = [];
    contacts = contacts.sort((a, b) => sortByFirstName(a, b));
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        renderLetterIfItHasNotBeenRendered(contact, renderedLetters);
        let contactColor = getContactColor(contact);
        contactList.innerHTML += contactInListTemplate(contact, contactColor, i);
    }
}


/**
 * This function finds the user with the matching e-mail address.
 * @param {string} eMail e-mail address
 * @returns {number} id of the user with the e-mail adress
 */
function getUserIdFromEMail(eMail) {
    let user = users.find(user => user.eMail === eMail);
    if (user) {
        return user.id;
    }
}


/**
 * This function removes a contact from the tasks assigned to it.
 * @param {string} contactEMail e-mail adress of the contact
 */
function removeUserFromAssignedTasks(contactEMail) {
    let userId = getUserIdFromEMail(contactEMail);
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let collaborators = task.collaborators;
        console.log('collaborators', collaborators);
        console.log('userId', userId);
        let collaboratorIndex = collaborators.indexOf(userId);
        if (collaboratorIndex > -1) {
            collaborators.splice(collaboratorIndex, 1);
        }
    }
}


function editContact(contactEMail) {
    let contact = contacts.find(contact => contact.eMail === contactEMail);
    let openTaskPopup = document.getElementById('edit-add-contact-pop-up');
    openTaskPopup.setAttribute('onclick', 'doNotClose(event)');
    openTaskPopup.innerHTML = contactEditForm(contact);
    centerPopup('edit-add-contact-pop-up');
}


/**
 * This function deletes a contact.
 * @param {string} contactEMail e-mail adress of the contact
 */
async function deleteContact(contactEMail) {
    let contact = contacts.find(contact => contact.eMail === contactEMail);
    let contactIndex = contacts.indexOf(contact);
    if (contactIndex > -1) {
        contacts.splice(contactIndex, 1);
    }
    removeUserFromAssignedTasks(contactEMail);
    await Promise.all([storeTasks(), storeContacts()]);
    renderContacts();
    let contactProfile = document.getElementById('contact-profile');
    contactProfile.innerHTML = '';
}


/**
 * This function opens a contact from the list.
 * @param {number} index contact index
 */
function openContact(event, index) {
    let contact = contacts[index];
    let contactProfile = document.getElementById('contact-profile');
    let contactColor = getContactColor(contact);
    contactProfile.innerHTML = contactProfileTemplate(contact, contactColor);
    setActiveContact(event, index);
}


function setActiveContact(event, index) {
    let contacts = document.querySelectorAll('.contact-in-list-active');
    for (let i = 0; i < contacts.length; i++) {
        contacts[i].classList.remove('contact-in-list-active');
    }
    let contact = document.getElementById(`contact-in-list${index}`);
    contact.classList.add('contact-in-list-active');
}


function saveEditedContact() {
    let contactNameInput = document.getElementById('contact-name-input');
    let contactEmailInput = document.getElementById('contact-email-input');
    let contactPhoneInput = document.getElementById('contact-phone-input');
    let name = contactNameInput.value;
    let email = contactEmailInput.value;
    let phone = contactPhoneInput.value;
    let editedContact = {
        firstName: getUserName('first', name),
        lastName: getUserName('last', name),
        color: getUserColor(),
        eMail: email,
        phone: phone
    }
    let foundContact = contacts.find(contact => contact.eMail === contactEMail);
    if (foundContact) {
        let contactIndex = contacts.indexOf(foundContact);
        contacts[contactIndex] = editedContact;
    } else {
        contacts.push(editedContact);
    }
    storeContacts();
}