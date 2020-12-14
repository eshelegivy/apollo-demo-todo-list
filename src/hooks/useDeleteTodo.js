import { gql, useMutation } from "@apollo/client";
import { parseApolloStoreFieldNameArgs } from "../helpers";

const DELETE_TODO_GQL = gql`
    mutation deleteTodo($id: String!) {
        deleteTodo(id: $id) {
            id
            text
            checked
            description
        }
    }
`;

export default () => {
    const [deleteTodo] = useMutation(DELETE_TODO_GQL, {
        update(cache, { data }) {
            const ref = cache.identify(data.deleteTodo);
            if (ref) {
                cache.evict({ id: cache.identify(data.deleteTodo) });
            }

            cache.modify({
                fields: {
                    todos(existing = [], { readField }) {
                        return existing.filter(currRef => readField('id', currRef) !== readField('id', ref));
                    },
                    todosCount(existing = 0, { storeFieldName, fieldName }) {
                        const queryArgs = parseApolloStoreFieldNameArgs(storeFieldName, fieldName);
                        if (queryArgs.filter && (queryArgs.filter.checked === data.deleteTodo.checked || !queryArgs.filter.checked)) {
                            return existing - 1;
                        }

                        return existing;
                    },
                },
            });
        },
    });

    const handleDelete = (todo) => {
        const {
            id, text, checked, description,
        }= todo
        deleteTodo({
            variables: { id },
            optimisticResponse: {
                __typename: 'Mutation',
                deleteTodo: {
                    __typename: 'Todo',
                    id,
                    text,
                    checked,
                    description,
                },
            },
        });
    }

    return {
        handleDelete,
    };
}
