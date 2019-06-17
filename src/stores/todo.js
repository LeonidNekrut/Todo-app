import { Store } from "laco";
import axios from 'axios';
import toast from "toasted-notes";

export const TodoStore = new Store(
    {
        todos: [],
        todo: axios.get(`http://localhost:8080/api/todos/`)
            .then(res =>{
                console.log(res);
                toast.notify('Todo retrieved successfully ');
            }),
        visibilityFilter: "All"
    },
    "TodoStore"
);


export const addTodo = text =>
    TodoStore.set(
        ({ todos }) => ({
            todo: axios.post(`http://localhost:8080/api/todos/`,{text})
                .then(res=> {
                    console.log(res);
                    toast.notify('Todo successfully created');
            }),
            todos: [
                ...todos,
                {
                    id: todos.reduce((maxId, todo) => Math.max(todo.id, maxId), +1) - 1,
                    completed: false,
                    text
                }
            ]
        }),
        "Add todo"
    );

export const deleteTodo = id =>
    console.log("id",id);
    TodoStore.set(
        ({todos, id, todo}) => ({
            todo: axios.delete(`http://localhost:8080/api/todos/`,{params: {id: todo.id}})
                .then(res => {
                    console.log(res);
                    toast.notify('Todo successfully deleted');
                }),
            todos: todos.filter(todo => todo.id === id),
        }),
        "Delete todo"
    );


export const editTodo = (id, text) =>
    TodoStore.set(
        ({ todos }) => ({
            todo: axios.put(`http://localhost:8080/api/todos/${id}`,{text})
                .then(res =>{
                    console.log(res);
                    toast.notify('Todo successfully edited');
                }),
            todos: todos.map(todo => (todo.id === id ? { ...todo, text } : todo))
        }),
        "Edit todo"
    );

export const completeTodo = id =>
    TodoStore.set(
        ({ todos }) => ({
            todos: todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        }),
        "Complete todo"
    );

export const completeAllTodos = () => {
    const todos = TodoStore.get().todos;
    const areAllMarked = todos.every(todo => todo.completed);
    TodoStore.set(
        () => ({
            todos: todos.map(todo => ({
                ...todo,
                completed: !areAllMarked
            }))
        }),
        "Complete all todos"
    );
};

export const clearCompletedTodos = () =>
    TodoStore.set(
        ({ todos }) => ({
            todos: todos.filter(t => t.completed === false)
        }),
        "Clear completed todos"
    );

export const getCompletedCount = todos =>
    todos.reduce((count, todo) => (todo.completed ? count + 1 : count), 0);

export const setVisibilityFilter = type =>
    TodoStore.set(
        () => ({
            visibilityFilter: type
        }),
        "Set visibility"
    );

export const getFilteredTodos = visibilityFilter => {
    const todos = TodoStore.get().todos;
    switch (visibilityFilter) {
        case "All":
            return todos;
        case "Completed":
            return todos.filter(t => t.completed);
        case "Active":
            return todos.filter(t => !t.completed);
        default:
            throw new Error("Unknown filter: " + visibilityFilter);
    }
};
