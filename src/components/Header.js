import React from "react";
import TodoTextInput from "./TodoTextInput";
import { addTodo } from "../stores/todo";
import toast from "toasted-notes";

const Header = () => (
    <header className="header">
        <h1>todos</h1>
        <TodoTextInput
            newTodo
            onSave={text => {
                if (text.length !== 0) {
                    toast.notify('Todo successfully created');
                    addTodo(text);
                }
            }}
            placeholder="What needs to be done?"
        />
    </header>
);

export default Header;
