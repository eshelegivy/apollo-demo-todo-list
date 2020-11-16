import { gql, useMutation } from "@apollo/client";
import { parseApolloStoreFieldNameArgs } from "../helpers";

const ADD_TODO_GQL = gql`
mutation AddTodo($text: String!, $checked: Boolean!, $description: String) {
  addTodo(text: $text, checked: $checked, description: $description) {
    id
    text
    checked
    description
  }
}
`;

export default () => {
    const [mutate, { loading, error }] = useMutation(ADD_TODO_GQL);

    const handleAddTodo = (text, description, checked) => {
        mutate({
            variables: {
            text,
            description,
            checked,
            },
            //   refetchQueries: ['getTodos'],
            optimisticResponse: {
                addTodo: {
                    id: `Temp-${Math.floor((1 + Math.random()) * 0x10000).toString()}`,
                    text,
                    description,
                    checked,
                    __typename: "Todo"
                },
            },
            nextFetchPolicy: 'cache-first',
            update(cache, { data: { addTodo } }) {
                cache.modify({
                    fields: {
                    todos(existingTodos = [], { storeFieldName, fieldName }) {
                        const queryArgs = parseApolloStoreFieldNameArgs(storeFieldName, fieldName);
                        if (queryArgs.filter && (queryArgs.filter.checked === true || !queryArgs.filter.checked)) {
                            const newTodoRef = cache.writeFragment({
                                data: addTodo,
                                fragment: gql`
                                fragment NewTodo on Todo {
                                    id
                                    text
                                    checked
                                    description
                                }
                                `
                            });

                            return [newTodoRef, ...existingTodos];
                        }

                        return existingTodos;
                    }
                    }
                });
            }
        });
    }

    return {
        handleAddTodo,
        loading,
        error,
    }
}