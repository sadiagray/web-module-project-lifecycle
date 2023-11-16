import React from 'react'
import axios from 'axios'

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

  axiosResponseError = err => this.setState({ ...this.setState, error: err.response.data.message })

  postNewTodo = () => {
    axios.post(URL, {name: this.state.todoInput })
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
        <div id="todos">
          <h2>Todos:</h2>
          {
            this.state.todos.reduce((acc,td) => {
              if (this.state.displayComplete || !td.completed) return acc.concat(
                <div onClick={this.toggleCompleted(td.id)} key={td.id}>{td.name} {td.completed ? ' ✔️' : ''}</div>
              )
              return acc
            }, [])
          }
        </div>
        <form id="todoForm" onSubmit={this.onTodoFormSubmit}>
          <input value={this.state.todoInput} onChange={this.onTodoInputChange} type="text" placeholder="Type todo"></input>
          <input type="submit"></input>
        </form>
        <button onClick={toggleDisplayComplete}>{this.state.diplayComplete ? 'Hide' : 'Show'} Completed</button>
      </div>
    )
  }
}
