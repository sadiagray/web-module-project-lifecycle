import React from 'react'
import axios from 'axios'
import Form from './Form'
import TodoList from './TodoList'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoInput: '',
    diplayComplete: true,
  }

  onTodoInputChange = evt => {
    const { value } = evt.target
    this.setState({ ...this.state, todoInput: value })
  }

  resetForm = () => this.setState({ ...this.state, todoInput: '' })

  axiosResponseError = err => this.setState({ ...this.state, error: err.response.data.message })

  postNewTodo = () => {
    axios.post(URL, { name: this.state.todoInput })
    .then(res => {
      this.setState({ ...this.state, todos: this.state.todos.concat(res.data.data) })
      this.resetForm()
    })
    .catch(this.axiosResponseError)
  }

  onTodoFormSubmit = evt => {
    evt.preventDefault()
    this.postNewTodo()
  }

  fetchAllTodos = () => {
    axios.get(URL)
    .then(res => {
      this.setState({ ...this.state, todos: res.data.data })
    })
    .catch(this.axiosResponseError)
  }

  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
      .then(res => {
        this.setState({ 
          ...this.state, todos: this.state.todos.map(td => {
            if (td.id !== id) return td
            return res.data.data
        })})
      })
      .catch(this.axiosResponseError)
  }

  toggleDisplayComplete = () => {
    this.setState({ ...this.state, displayComplete: !this.state.displayComplete })
  }

  componentDidMount() {
    this.fetchAllTodos()
  }

  render() {
    return (
      <div>
        <div id="error">Error: {this.state.error}</div>
        <TodoList
        todos={this.state.todos}
        displayComplete={this.state.displayComplete}
        toggleCompleted={this.toggleCompleted}
        />
       <Form
        onTodoFormSubmit={this.onTodoFormSubmit}
        onTodoInputChange={this.onTodoInputChange}
        toggleDisplayComplete={this.toggleDisplayComplete}
        todoInput={this.state.todoInput}
        diplayComplete={this.state.displayComplete}
       />
      </div>
    )
  }
}
