function init() {
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = 'Loading task list from the server, please wait...'
    loadTodos()
}

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
      // create a new span-element, with the letter X inside it, to delete tasks
    let span = document.createElement('span')
      // create a new class-attribute
    let span_attr = document.createAttribute('class')
      /* attach the 'delete' value to the attribute, i.e. the class is 
      'delete', so the 'delete' class styles can be applied */
    span_attr.value = 'delete'
      // add the attribute to the span-element
    span.setAttributeNode(span_attr)
      // create a text node containing the letter X
    let x = document.createTextNode(' x ')
      // attach the x-span node to the span element (visible)
    span.appendChild(x)
      // configure the span-element's onclick-event to call the removeTodo function
    span.onclick = function() { removeTodo(todo._id) }
      // add a span-element to the li-element
    li.appendChild(span)
      // return the created li-element
      // it then has the form: <li id="mongoIDXXXXX">Remember to call...<span class="remove">x</span></li>
    return li
  }

  function showTodos(todos) {
    let todosList = document.getElementById('todosList')
    let infoText = document.getElementById('infoText')
    // no todos
    if (todos.length === 0) {
      infoText.innerHTML = 'No todos'
    } else {    
      todos.forEach(todo => {
          let li = createTodoListItem(todo)        
          todosList.appendChild(li)
      })
      infoText.innerHTML = ''
    }
  }

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

  async function removeTodo(id) {
    const response = await fetch('http://localhost:3000/todos/'+id, {
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