const parseApolloStoreFieldNameArgs = (storeFieldName, fieldName) => {
    const storeFieldArgs = JSON.parse(storeFieldName.replace(`${fieldName}:`, ''));
    if (!storeFieldArgs) return undefined;

    return storeFieldArgs;
};

module.exports = {
    parseApolloStoreFieldNameArgs,
}