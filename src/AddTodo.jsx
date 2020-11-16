import React, { useRef } from "react";
import useAddTodo from './hooks/useAddTodo';

export default function AddUser() {
  const { handleAddTodo, loading, error } = useAddTodo();
  const textRef = useRef();
  const descRef = useRef();

  const handleClick = () => {
    const text = textRef.current.value;
    const description = descRef.current.value;
    const checked = false;

    handleAddTodo(text, description, checked);
  };

  if (error) {
    return <p>Could not add todo</p>;
  }

  return (
    <div>
      <div className="todo-form">
        <input ref={textRef} type="text" name="text" placeholder="Text" />
        <textarea ref={descRef} name="description" placeholder="Description" />
        <div>
          <button disabled={loading} onClick={handleClick}>
            {loading ? "Adding..." : "Add Todo"}
          </button>
        </div>
      </div>
    </div>
  );
}
