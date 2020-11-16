import { useState } from "react";
import { gql, useQuery, NetworkStatus } from "@apollo/client";

const ALL_TODOS_GQL = gql`
  query getTodos($filter: TodosFilter, $offset: Int, $limit: Int) {
    todos(filter: $filter, offset: $offset, limit: $limit) {
      id
      text
      checked
      description
    }
    todosCount(filter: $filter)
  }
`;

const logStatus = (status) => {
    switch(status) {
        case NetworkStatus.loading:
            console.log('Status: Loading...');
            break;
        case NetworkStatus.fetchMore:
            console.log('Status: Fetching more...');
            break;
        case NetworkStatus.refetch:
            console.log('Status: Refetching...');
            break;
        case NetworkStatus.ready:
            console.log('Status: Ready!');
            break;
    }
}


const getTodosFilter = (filter) => {
    switch(filter) {
        case 'all':
            return null;
        break;
        case 'checked':
            return true;
        break;
        case 'unchecked':
            return false;
        break;
    }
};

const TODOS_PER_PAGE = 30;

export default (filter) => {
    const [limit, setLimit] = useState(TODOS_PER_PAGE);

    const { error, data, fetchMore, networkStatus, refetch } = useQuery(ALL_TODOS_GQL, {
        variables: {
            offset: 0,
            limit: limit,
            filter: {
                checked: getTodosFilter(filter),
            },
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
    });

    const handleFetchMore = () => {
        const currentLength = data?.todos?.length || 0;
        fetchMore({
            variables: {
                offset: currentLength,
                limit: TODOS_PER_PAGE,
                filter: {
                    checked: getTodosFilter(filter),
                },
            },
            // updateQuery: (prev, { fetchMoreResult }) => {
            //     if (fetchMoreResult) {
            //         return Object.assign({}, prev, {
            //             todos: [...prev.todos, ...fetchMoreResult.todos],
            //         });
            //     }

            //     return prev;
            // },
        }).then(res => setLimit(currentLength + res.data.todos.length || limit));
    };

    const isLoading = networkStatus === NetworkStatus.loading;
    const isFetchingMore = networkStatus === NetworkStatus.fetchMore;
    const isReFetching = networkStatus === NetworkStatus.refetch;

    logStatus(networkStatus);


    return {
        handleFetchMore,
        isLoading,
        isFetchingMore,
        isReFetching,
        error,
        data,
        fetchMore,
        networkStatus,
        refetch,
    }
}