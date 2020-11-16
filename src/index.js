import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { offsetLimitPagination } from '@apollo/client/utilities';

import App from "./App";

const rootElement = document.getElementById("root");

const cacheOptions = {
    typePolicies: {
        Query: {
            fields: {
                todos: offsetLimitPagination(['filter']),
                todosCount: { keyArgs: ['filter'] },
            },
        },
    },
};

const client = new ApolloClient({
  cache: new InMemoryCache(cacheOptions),
  uri: "https://6ogpm.sse.codesandbox.io/", // server code: https://codesandbox.io/s/todos-type-policies-mufdh
  connectToDevTools: true,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  rootElement
);
