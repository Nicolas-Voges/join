// Board templates

/**
 * This function returns an HTML template showing the progress of a task or an empty string if there are no subtasks
 * @param {Object} task 
 * @param {number} doneSubtasks number of completed subtasks
 * @returns 
 */
function generateTaskProgressContainerTemplate(task, doneSubtasks) {
    if (task.subtasks.length > 0) {
        return /* html */ `<div class="task-progress-container">
            <progress class="task-progress" max="100" value="${doneSubtasks/task.subtasks.length * 100}"></progress>
            <span>${doneSubtasks}/${task.subtasks.length} subtasks</span>
            <span class="subtask-tooltip">${doneSubtasks} of ${task.subtasks.length} subtasks completed</span>
        </div>`;
    } else {
        return '';
    }
}


/**
 * This function returns an HTML template of a task
 * @param {Object} task
 * @param {number} doneSubtasks number of completed subtasks
 * @returns {string} task HTML template
 */
function taskTemplate(task, doneSubtasks) {
    return /* html */ `<div class="task" draggable="true" ondragstart="startDraggingTask(event, ${task.id})" ondragend="endDraggingTask(event)" onclick="openTask(${task.id})">
            <div class="task-category-and-mobile-drag-arrows-container">
                <div class="task-category task-category-small ${task.category === 'Technical Task' ? 'technical-task' : 'user-story'}">${task.category}</div>
                <div class="move-arrows" onclick="openMoveTaskPopup(event, ${task.id})">⇵</div>
            </div>
            <div class="task-title-and-description-container">
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
            </div>
            ${generateTaskProgressContainerTemplate(task, doneSubtasks)}
            <div class="initial-avatars-and-priority-container">
                <div id="initial-avatars">${generateInitialAvatarsTemplate(task)}</div>
                <img src="${'../assets/img/' + task.priority.toLowerCase() + '-board-priority-icon.svg'}" class="priority-icon">
            </div>
        </div>`;
}


function openTaskPopupTemplate(task) {
    return /* html */ `<div class="open-task-pop-up-header">
        <div id="open-task-pop-up-category">${openTaskPopupCategoryTemplate(task)}</div>
        <img class="close-pop-up-icon" src="assets/img/close-pop-up-icon.svg" alt="close pop-up icon" onclick="removePopup('open-task-pop-up')">
    </div>
    <div class="open-task-pop-up-content">
        <h2 id="open-task-heading">${task.title}</h2>
        <div id="open-task-description">${task.description}</div>
        <div class="open-task-due-date-outer-container">
                <div>Due date:</div>
                <div id="open-task-due-date">${task.dueDate}</div>
        </div>
        <div class="open-task-priority-outer-container">
                <div>Priority:</div>
                <div id="open-task-priority">${openTaskPopupPriorityTemplate(task)}</div>
        </div>
        <div class="open-task-collaborators-outer-container">
            <div id="open-task-collaborators">${generateCollaboratorNames(task)}</div>
        </div>
        <div class="open-task-subtasks-outer-container">
            <div id="open-task-subtasks">${generateSubtasks(task, task.subtasks)}</div>
        </div>
        <div class="open-task-buttons-container">
            <div id="open-task-delete-button" class="open-task-button cursor-pointer" onclick="deleteTask(${task.id})">
                <img src="assets/img/open-task-delete-button-icon.svg" alt="open task delete button icon">
                <span>Delete</span>
            </div>
            <div class="open-task-button-separator"></div>
            <div id="open-task-edit-button" class="open-task-button cursor-pointer" onclick="editTask(${task.id})">
                <img src="assets/img/open-task-edit-button-icon.svg" alt="open task edit button icon">
                <span>Edit</span>
            </div>
        </div>
    </div>`;
}


function editTaskTemplate(task) {
    return /* html */ `
        <div class="edit-task-pop-up-header">
            <img class="close-pop-up-icon" src="assets/img/close-pop-up-icon.svg" alt="close pop-up icon" onclick="removePopup('open-task-pop-up')">
        </div>
        <form class="edit-task-form" onsubmit="onSubmitEditTaskForm(${task.id}); return false">
            <div class="open-task-pop-up-content">
                <div class="form-label-and-input-container">
                    <label for="edit-task-title-input" class="task-form-label">Title</label>
                    <input id="edit-task-title-input" class="task-title-input" type="text" placeholder="Enter a title" value="${task.title}" required>
                </div>
                <div class="form-label-and-input-container">
                    <label for="edit-task-description-textarea" class="task-form-label">Description</label>
                    <textarea id="edit-task-description-textarea" class="task-title-input" type="text" placeholder="Enter a description" required>${task.description}</textarea>
                </div>
                <div class="form-label-and-input-container">
                    <label for="edit-task-due-date" class="task-form-label">Due date</label>
                    <input id="edit-task-due-date" class="task-title-input" type="date" placeholder="Enter a due date" value="${task.dueDate}" required>
                </div>
                <div class="form-label-and-input-container">
                    <label for="edit-task-due-date" class="task-form-label task-form-label-priority">Priority</label>
                    <div class="edit-task-priority-buttons-container">
                        <button id="priority-button-urgent" class="edit-task-priority-button" type="button" onclick="clickPriorityButton('urgent')">
                            <span>Urgent</span>
                            <img id="priority-icon-urgent" src="../assets/img/priority-icon-urgent.svg" alt="priority icon urgent">
                        </button>
                        <button id="priority-button-medium" class="edit-task-priority-button" type="button" onclick="clickPriorityButton('medium')">
                            <span>Medium</span>
                            <img id="priority-icon-medium" src="../assets/img/priority-icon-medium.svg" alt="priority icon medium">
                        </button>
                        <button id="priority-button-low" class="edit-task-priority-button" type="button" onclick="clickPriorityButton('low')">
                            <span>Low</span>
                            <img id="priority-icon-low" src="../assets/img/priority-icon-low.svg" alt="priority icon low">
                        </button>
                    </div>
                </div>
                <div class="form-label-and-input-container">
                    ${editTaskAssignedToItemsTemplate(task)}
                </div>
                <div class="form-label-and-input-container">
                    <div id="open-task-subtasks">${generateSubtasksTemporary(task, task.subtasks)}</div>
                </div>
            </div>
            <button class="button edit-task-ok-button">OK</button>
        </form>`;
}


function openTaskPopupCategoryTemplate(task) {
    return /* html */ `<div class="task-category task-category-large ${task.category === 'Technical Task' ? 'technical-task' : 'user-story'}">${task.category}</div>`;
}


function openTaskPopupPriorityTemplate(task) {
    return /* html */ `<div>${task.priority}</div>
        <img src="${'../assets/img/' + task.priority.toLowerCase() + '-board-priority-icon.svg'}" class="priority-icon">`;
}


/**
 * This function returns an initial avatar HTML template for a user
 * @param {Object} user 
 * @returns {string} inital avatar HTML template
 */
function initialAvatarTemplate(user) {
    return /* html */ `<div class="initial-avatar ${user.color}">${getInitials(user)}</div>`;
}


/**
 * This function returns an initial avatar HTML template for a user
 * @param {Object} user 
 * @returns {string} inital avatar HTML template
 */
function initialAvatarLargeTemplate(user) {
    return /* html */ `<div class="initial-avatar initial-avatar-large ${user.color}">${getInitials(user)}</div>`;
}



/**
 * This function returns an HTML template with inital avatars of all the collaborators of a task
 * @param {Object} task 
 * @returns {string} HTML string of initial avatar divs
 */
function generateInitialAvatarsTemplate(task) {
    let collaborators = getCollaborators(task);
    let HTMLString = '';
    if (collaborators) {
        for (let i = 0; i < collaborators.length; i++) {
            let collaborator = collaborators[i];
            HTMLString += initialAvatarTemplate(collaborator);
        }
    }
    return HTMLString;
}


function generateCollaboratorNames(task) {
    let collaborators = getCollaborators(task);
    let HTMLString = '';
    if (collaborators) {
        HTMLString = `<div class="collaborator-names-container">
        <div>Assigned to:</div>
        <div class="collaborator-names">`;
            if (collaborators) {
                for (let i = 0; i < collaborators.length; i++) {
                    let collaborator = collaborators[i];
                    HTMLString += collaboratorNameTemplate(collaborator);
                }
            }
        HTMLString += `</div>
        </div>`;
    }
    return HTMLString;
}


function generateCollaboratorAvatars(task) {
    let collaborators = getCollaborators(task);
    let HTMLString = '';
    if (collaborators) {
        for (let i = 0; i < collaborators.length; i++) {
            let collaborator = collaborators[i];
            HTMLString += initialAvatarLargeTemplate(collaborator);
        }
    }
    return HTMLString;
}


function collaboratorNameTemplate(user) {
    return /* html */ `<div class="collaborator-name-outer-container">
        <div class="collaborator-name-container">
            ${initialAvatarLargeTemplate(user)}
            <div class="collaborator-name">${user.firstName} ${user.lastName}</div>
        </div>
    </div>`;
}


function subTaskTemplate(subtask, subtaskIndex, taskId) {
    return /* html */ `
        <div class="subtask">
            <img class="cursor-pointer" src="${subtask.done ? 'assets/img/checkbox-icon-checked.svg' : 'assets/img/checkbox-icon-unchecked.svg'}" alt="subtask checkbox icon" onclick="checkOrUncheckSubtaskBox(${taskId}, ${subtaskIndex})">
            <div class="subtask-title">${subtask.title}</div>
        </div>
    `;
}



function subTaskTemplateTemporary(subtask, subtaskIndex, taskId) {
    return /* html */ `
        <div class="subtask">
            <img class="cursor-pointer" src="${subtask.done ? 'assets/img/checkbox-icon-checked.svg' : 'assets/img/checkbox-icon-unchecked.svg'}" alt="subtask checkbox icon" onclick="checkOrUncheckSubtaskBoxTemporary(${taskId}, ${subtaskIndex})">
            <div class="subtask-title">${subtask.title}</div>
        </div>
    `;
}


function generateSubtasks (task, subtasks) {
    console.log('subtasks', subtasks)
    let HTMLString = '';
    if (subtasks.length > 0) {
        HTMLString = `<div class="subtasks-container">
        <div>Subtasks</div>
        <div class="subtasks">`;
            if (subtasks) {
                for (let i = 0; i < subtasks.length; i++) {
                    let subtask = subtasks[i];
                    HTMLString += subTaskTemplate(subtask, i, task.id);
                }
            }
        HTMLString += `</div>
        </div>`;
    }
    return HTMLString;
}


function generateSubtasksTemporary (task, subtasks) {
    console.log('subtasks', subtasks)
    let HTMLString = '';
    if (subtasks.length > 0) {
        HTMLString = `<div class="subtasks-container">
        <div>Subtasks</div>
        <div class="subtasks">`;
            if (subtasks) {
                for (let i = 0; i < subtasks.length; i++) {
                    let subtask = subtasks[i];
                    HTMLString += subTaskTemplateTemporary(subtask, i, task.id);
                }
            }
        HTMLString += `</div>
        </div>`;
    }
    return HTMLString;
}


function editTaskAssignedToItemsTemplate(task) {
    return /* html */ `
        <label for="edit-task-assigned-to" class="task-form-label">Assigned to</label>
        <div class="task-drop-down">
            <input id="task-drop-down-input" type="text" class="task-title-input" onclick="onTaskDropDownInputClick()" oninput="searchUsers(${task.id})" placeholder="Select contacts to assign">
            <img class="arrow-drop-down" src="../assets/img/arrow-drop-down.svg" alt="drop-down arrow">
        </div>
        <div id="edit-task-assigned-to" class="task-user-dropdown display-none">
            ${renderSelectOptions(task, users)}
        </div>
        <div id="initial-avatars-large-container">
            ${generateCollaboratorAvatars(task)}
        </div>
    `;
}


// Contacts templates

/**
 * This function generates an HTML template for the letter that is used as a heading for contacts with first names beginning with the same letter
 * @param {string} letter 
 * @returns {string} contact letter HTML template
 */
function contactLetterTemplate(letter) {
    return /* html */ `<div class="contact-letter">${letter}</div>
                        <div class="contacts-separator-container">
                            <hr>
                        </div>`;
}


/**
 * This function generates an HTML template for the contact in the contacts list
 * @param {Object} contact 
 * @param {string} userColor 
 * @returns 
 */
function contactInListTemplate(contact, contactColor, contactIndex) {
    return /* html */ `<div class="contact-in-list cursor-pointer" onclick="openContact(${contactIndex})">
        <div class="contact-initial-avatar-small ${contactColor}">${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}</div>
        <div class="contact-in-list-info">
            <div>${contact.firstName} ${contact.lastName}</div>
            <a href="mailto:${contact.eMail}">${contact.eMail}</a>
        </div>
    </div>`;
}


/**
 * This function generates a contact profile HTML template
 * @param {Object} contact 
 * @param {string} contactColor
 * @returns {string} contact profile HTML template
 */
function contactProfileTemplate(contact, contactColor) {
    return /* html */ `
    <div class="contact-profile-header">
        <div class="contact-initial-avatar-large ${contactColor}">${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}</div>
            <div class="contact-name-and-buttons-container">
                <h3>${contact.firstName} ${contact.lastName}</h3>
                <div class="contact-buttons">
                    <div class="contact-button">
                        <img src="assets/img/contact-edit-button-icon.svg" alt="contact edit button icon">
                        <span>Edit</span>
                    </div>
                    <div class="contact-button cursor-pointer" onclick="deleteContact('${contact.eMail}')">
                        <img src="assets/img/contact-delete-button-icon.svg" alt="contact delete button icon">
                        <span>Delete</span>
                    </div>
                </div>
            </div>
        </div>
    <div class="contact-information-heading">Contact information</div>
    <div class="contact-information-facts-container">
        <div class="contact-information-fact">
            <div class="contact-information-fact-heading">Email</div>
            <a href="mailto:${contact.eMail}">${contact.eMail}</a>
        </div>
        <div class="contact-information-fact">
            <div class="contact-information-fact-heading">Phone</div>
            <div>${contact.phone}</div>
        </div>
    </div>
    `;
}

/**
 * This function generates a list to assign a task to contacs
 */

function generateAssignedList(contact, contactColor){
    return /*html*/ `
    <div>
        <div>${contact.firstName} ${contact.lastName}</div>
    </div>
    `
}