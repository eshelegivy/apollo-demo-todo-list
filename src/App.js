import React, { useState } from "react";
import { gql, useQuery, useMutation, NetworkStatus, useLazyQuery, useApolloClient } from "@apollo/client";
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

    /** read fresh data of the todo item (just for the test) */
    const [getDetails, { data, loading: todoDetailsLoading, error: todoDetailsError}] = useLazyQuery(GET_TODO_GQL, {});
    const handleTodoClick = (todoId) => {
        getDetails({
            variables: {
                id: todoId,
            },
        })
    }

    // const [todoDetails, setTodoDetails] = useState(null);
    // const client = useApolloClient();

    // const handleTodoClick = (todoId) => {
    //     const todo = client.readFragment({
    //         id: `Todo:${todoId}`,
    //         fragment: gql`
    //           fragment TodoDetails on Todo {
    //             id
    //             text
    //             checked
    //             description
    //           }
    //         `,
    //     });

    //     setTodoDetails(todo);
    // }

    return (
        <div className="App">
        <AddTodo />
        <div className="wrapper">
            <Todos onTodoClick={handleTodoClick} />
            <TodoDetails todo={data && data.todo} loading={todoDetailsLoading} error={todoDetailsError}/>
            {/* <TodoDetails todo={todoDetails}/> */}
        </div>
        </div>
    );
}
