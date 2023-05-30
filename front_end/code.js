// On page load, the todos get loaded using the loadTodos() function
function init() {
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = 'Loading task list from the server, please wait...'
    loadTodos()
}

// fetch the todos from the database and show them using the showTodos() function
async function loadTodos() {
    let response = await fetch('http://localhost:3000/todos')
    let todos = await response.json()
    console.log(todos)
    showTodos(todos)
}

function createTodoListItem(todo) {
    // create a new li-element
    let li = document.createElement('li')
    // create a new id-attribute
    let li_attr = document.createAttribute('id')
    // attach the value of the task/todo ID to the created attribute
    li_attr.value = todo._id
    // attach the attribute to the li-element
    li.setAttributeNode(li_attr)
    // create a new text node containing the task/todo text
    let text = document.createTextNode(todo.text)
    // add the text to the li-element
    li.appendChild(text)
    // create a new span-element, with the word 'edit' inside it, to edit tasks
    // this part is for creating the EDIT button
    let span_edit = document.createElement('span')
    // create a new class-attribute
    let span_edit_attr = document.createAttribute('class')
    /* attach the 'delete' value to the attribute, i.e. the class is 
    'delete', so the 'delete' class styles can be applied */
    span_edit_attr.value = 'edit'
    // add the attribute to the span-element
    span_edit.setAttributeNode(span_edit_attr)
    // create a text node containing the word 'edit'
    let edit = document.createTextNode(' edit ')
    // attach the edit-span node to the span element (visible)
    span_edit.appendChild(edit)
    // configure the span-element's onclick-event to call the editTodo function
    span_edit.onclick = function () { editTodo(todo._id) }
    // add a span-element to the li-element
    li.appendChild(span_edit)
    // return the created li-element
    // this part is for creating the DELETE button (the 'x')
    let span_del = document.createElement('span')
    // create a new class-attribute
    let span_del_attr = document.createAttribute('class')
    /* attach the 'delete' value to the attribute, i.e. the class is 
    'delete', so the 'delete' class styles can be applied */
    span_del_attr.value = 'delete'
    // add the attribute to the span-element
    span_del.setAttributeNode(span_del_attr)
    // create a text node containing the letter X
    let x = document.createTextNode(' x ')
    // attach the x-span node to the span element (visible)
    span_del.appendChild(x)
    // configure the span-element's onclick-event to call the removeTodo function
    span_del.onclick = function () { removeTodo(todo._id) }
    // add a span-element to the li-element
    li.appendChild(span_del)
    // return the created li-element
    return li
}

/* check if there are any items in the database, 
and store them in the todosList variable */
function showTodos(todos) {
    let todosList = document.getElementById('todosList')
    let infoText = document.getElementById('infoText')
    // no todos
    if (todos.length === 0) {
        infoText.innerHTML = 'No todos'
    } else {
        // add each todo to the list
        todos.forEach(todo => {
            let li = createTodoListItem(todo)
            todosList.appendChild(li)
        })
        infoText.innerHTML = ''
    }
}

// get the text from the input box, and post it to the server
async function addTodo() {
    let newTodo = document.getElementById('newTodo')
    const data = { 'text': newTodo.value }
    const response = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let todo = await response.json()
    let todosList = document.getElementById('todosList')
    let li = createTodoListItem(todo)
    todosList.appendChild(li)

    let infoText = document.getElementById('infoText')
    infoText.innerHTML = ''
    newTodo.value = ''
}

// through clicking the X, a delete request for a specific todo gets sent
async function removeTodo(id) {
    const response = await fetch('http://localhost:3000/todos/' + id, {
        method: 'DELETE'
    })
    let responseJson = await response.json()
    let li = document.getElementById(id)
    li.parentNode.removeChild(li)

    let todosList = document.getElementById('todosList')
    if (!todosList.hasChildNodes()) {
        let infoText = document.getElementById('infoText')
        infoText.innerHTML = 'No todos'
    }
}

/* clicking the 'edit' button gets the text from the todo, and puts
it in the text box. The grey 'add' button changes into a yellow 'save' button */
async function editTodo(id) {
    var addButton = document.querySelector('button[onclick="addTodo()"]');
    addButton.setAttribute("onclick", `saveEditedTodo('${id}')`);
    addButton.textContent = "Save";
    addButton.id = "save-button";
    
    let editedTodo = document.getElementById('newTodo');

    let li = document.getElementById(id);
    let todoText = li.firstChild.nodeValue;

    editedTodo.value = todoText;
}

// clicking 'save' activates the put-function, thus updating the todo
async function saveEditedTodo(id) {
    let editedTodo = document.getElementById('newTodo');
    const data = { 'text': editedTodo.value };
    const response = await fetch('http://localhost:3000/todos/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    
    /* if the server says the todo got successfully updated,
    the website will display the updated todo, and the text box
    will be emptied */
    if (response.ok) {
        let li = document.getElementById(id);
        li.firstChild.nodeValue = editedTodo.value;
        editedTodo.value = '';

        // the yellow 'Save' button changes back to a grey 'Add' button
        var addButton = document.querySelector('button[onclick="saveEditedTodo(\'' + id + '\')"]');
        addButton.setAttribute("onclick", "addTodo()");
        addButton.textContent = "Add";
        addButton.id = "edit-button";
    }
}
