import React, { Component } from 'react';
import TodoList from './Components/TodoList';
import axios from 'axios';

let count = 1;

const todoAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

class App extends Component {
  state = {
    loading: false,
    todos: [
      // {
      //   id: count++,
      //   body: 'React 공부',
      //   complete: true
      // },
      // {
      //   id: count++,
      //   body: 'Redux 공부',
      //   complete: false
      // },
    ],
    newTodoBody: ''
  }

  async componentDidMount(){
    await this.fetchTodos();
  }

  fetchTodos = async () => {
    this.setState({
      loading: true
    })

    const res = await todoAPI.get('./todos');
    this.setState({
      todos: res.data,
      loading: false
    })
  }

  handleInputChange = e => {
    this.setState({
      newTodoBody: e.target.value
    });
  }

  handleButtonClick = async e => {
    if (this.state.newTodoBody) {
      const newTodo = {
        body: this.state.newTodoBody,
        complete: false
      };

      this.setState({
        loading: true
      });
      await todoAPI.post('/todos', newTodo);
      await this.fetchTodos();
      

      this.setState({
        // todos: [
        //   ...this.state.todos,
        //   newTodo
        // ],
        newTodoBody: ''
      });
    }
  }

  handleTodoItemBodyUpdate = async (id,body) => {
    this.setState({
      loading: true
    });

    await todoAPI.patch(`/todos/${id}`, {
      body
    })

    await this.fetchTodos();
  }

  handleTodoItemComplete = async id => {

    this.setState({
      loading: true
    });

    await todoAPI.patch(`/todos/${id}`, {
      complete: true
    });

    await this.fetchTodos();
  }

  handleTodoItemDelete = async id => {
    this.setState({
      todos: this.state.todos.filter(t => id !== t.id)
    })

    await todoAPI.delete(`/todos/${id}`)

    await this.fetchTodos();
  }

  render() {
    const {todos, newTodoBody, loading} = this.state;
    return (
      <div>
        <h1>할 일 목록</h1>
        <label>
          새 할일
          <input type="text" value={newTodoBody} onChange={this.handleInputChange} />
          <button onClick={this.handleButtonClick}>추가</button>
        </label>
        {loading ? (
          <div>loading...</div>
        ): (
          <TodoList 
            todos={todos}
            handleTodoItemComplete = {this.handleTodoItemComplete}
            handleTodoItemDelete = {this.handleTodoItemDelete}
            handleTodoItemBodyUpdate = {this.handleTodoItemBodyUpdate}
          />
        )}
      </div>
    );
  }
}


export default App;
