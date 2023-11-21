import {GridApi, IRowNode} from "@ag-grid-community/core";

/**
 *  获取 ag-grid 当前页node
 *  @param api ag-grid API
 */
const getPageDisplayedNodes: (api: GridApi) => any[] = api => {
    const currentPage = api.paginationGetCurrentPage();
    const pageSize = api.paginationGetPageSize();
    const rowCount = api.paginationGetRowCount()

    const startIndex = currentPage * pageSize;
    let endIndex = startIndex + pageSize - 1
    if (endIndex >= rowCount) endIndex = rowCount - 1
    const nodes: IRowNode[] = []

    for(let i = startIndex; i <= endIndex; i++) {
        const node =  api.getDisplayedRowAtIndex(i)
       if (node) nodes.push(node)
    }
    return nodes
}

export { getPageDisplayedNodes }