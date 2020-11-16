import React from "react";


export default function TodoDetails({ todo, loading, error }) {

    if (error) {
        return <div>{error}</div>
    }

    return (
        <div className="details-wrapper">
            <div>Details: </div>
            {loading && <div>Loading...</div>}
            {todo && (
                <div>
                    <div>ID: {todo.id}</div>
                    <div>Text: {todo.text}</div>
                    <div>Description: {todo.description}</div>
                </div>
            )}
        </div>
    );
}
