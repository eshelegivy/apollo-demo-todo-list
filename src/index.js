import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App";

const rootElement = document.getElementById("root");

const cacheOptions = {
    typePolicies: {
        Query: {
            fields: {
                todos: {
                    keyArgs: ['filter'],
                    merge(existing, incoming, { args: { offset = 0 } }) {
                        const merged = existing ? existing.slice(0) : [];
                        for (let i = 0; i < incoming.length; i += 1) {
                            merged[offset + i] = incoming[i];
                        }

                        return merged;
                    },
                },
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
