import React, { useState } from "react";
import { gql, useQuery, useMutation, NetworkStatus, useLazyQuery } from "@apollo/client";
import { Waypoint } from 'react-waypoint';
import { parseApolloStoreFieldNameArgs } from "./helpers";

import useDeleteTodo from './hooks/useDeleteTodo';
import useGetTodos from './hooks/useGetTodos';

const GET_TODO_GQL = gql`
query getTodo($id: String!) {
  todos(id: $id) {
    id
    text
    checked
    description
  }
}
`;

export default function Todos({ onTodoClick }) {
    const [filter, setFilter] = useState('all');
    const { handleDelete } = useDeleteTodo();
    const { data, handleFetchMore, refetch, error, isLoading, isFetchingMore, isReFetching,
    } = useGetTodos(filter);

    const [getDetails, { loadingDetails }] = useLazyQuery(GET_TODO_GQL, {});


    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    }

    if (isLoading || !data) {
        return <p>Loading…</p>;
    }

    if (error) {
        return <p>Error</p>;
    }

    return (
        <div className="list-container">
            <button disabled={isReFetching} onClick={() => refetch()}>{isReFetching ? 'ReFetching...' : 'Refetch'}</button>
            <div>
                <span>
                    <input type="radio" id="all" name="filter" checked={filter === 'all'} value="all" onChange={handleFilterChange} />
                    <label htmlFor="all">All</label>
                    <input type="radio" id="unchecked-only" name="filter" checked={filter === 'unchecked'} value="unchecked" onChange={handleFilterChange} />
                    <label htmlFor="unchecked-only">Unchecked</label>
                    <input type="radio" id="checked-only" name="filter" checked={filter === 'checked'} value="checked" onChange={handleFilterChange} />
                    <label htmlFor="checked-only">Checked</label>
                </span>
            </div>
            <ul>
                {data.todos.map((todo) => (
                    <li key={todo.id} className={`todo_item ${todo.id.startsWith('Temp') ? 'saving' : 'saved'}`}>
                        <div className="delete-button" onClick={() => handleDelete(todo)}>x</div>
                        <div onClick={() => onTodoClick(todo)}>
                            {todo.checked ? "V" : "X"} - {todo.text}{" "}
                        </div>
                    </li>
                ))}
                {data.todos.length < data.todosCount && (
                    <Waypoint onEnter={handleFetchMore} bottomOffset="0" />
                )}
                {isFetchingMore && (
                    <div className="loader-container">
                        <div className="loader" ></div>
                    </div>
                )}
            </ul>
            <div>Total: {data.todosCount}</div>
        </div>
    );
}
