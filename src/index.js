const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username === username)

  if (!user) {
    return response.status(404).json({ error: 'Usuário não encontrado'});
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.find((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "Já existe um usuário com o username solicitado"})
  }

  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;


  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  request.user.todos.push(todo)

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const todoFiltered = user.todos.find((todo) => todo.id === id);

  if (!todoFiltered) {
    return response.status(404).json({ error: 'Não foi possível encontrar um TODO'});
  }

  const todoUpdated = {
    ...todoFiltered,
    title: title,
    deadline: new Date(deadline)
  }

  user.todos.splice(todoFiltered, 1);

  user.todos.push(todoUpdated);

  return response.json(todoUpdated);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request

  const todoFiltered = user.todos.find((todo) => todo.id === id);

  if (!todoFiltered) {
    return response.status(404).json({ error: 'Não foi possível encontrar um TODO'});
  };

  const todoWithStepUpdated = {
    ...todoFiltered,
    done: true,
  }

  user.todos.splice(todoFiltered, 1);
  user.todos.push(todoWithStepUpdated);

  return response.json(todoWithStepUpdated)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todoFiltered = user.todos.find((todo) => todo.id === id);

  if (!todoFiltered) {
    return response.status(404).json({ error: 'Não foi possível encontrar um TODO'});
  };

  user.todos.splice(todoFiltered, 1);

  return response.status(204).json();
});

module.exports = app;