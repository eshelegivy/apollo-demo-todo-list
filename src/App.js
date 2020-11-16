import React, { useState } from "react";
import { gql, useQuery, useMutation, NetworkStatus, useLazyQuery } from "@apollo/client";
import Todos from "./Todos.jsx";
import AddTodo from "./AddTodo.jsx";
import TodoDetails from "./TodoDetails.jsx";
import "./styles.css";

const GET_TODO_GQL = gql`
    query getTodo($id: String!) {
        todo(id: $id) {
            id
            text
            checked
            description
        }
    }
`;

export default function App() {
    const [getDetails, { data, loading: todoDetailsLoading, error: todoDetailsError}] = useLazyQuery(GET_TODO_GQL, {});
   
    const handleTodoClick = (todo) => {
        getDetails({
            variables: {
                id: todo.id,
            },
        })
    }

    return (
        <div className="App">
        <AddTodo />
        <div className="wrapper">
            <Todos onTodoClick={handleTodoClick} />
            <TodoDetails todo={data && data.todo} loading={todoDetailsLoading} error={todoDetailsError}/>
        </div>
        </div>
    );
}
