import { AgGridReactProps } from '@ag-grid-community/react';
import { 
    RowModelType, ServerSideStoreType, IServerSideDatasource
 } from '@ag-grid-community/core';
import { CSSProperties } from 'react';
export * from '@ag-grid-community/core'

export interface AgGridProps extends AgGridReactProps {
    /* 表格数据请求 */
    serverApi?: ServerApi;

    /* 表格数据请求参数 */
    serverParams?: Record<string, any>,

    sizeColumnsToFit?: boolean;

    onCellSeleted?: (params: any) => void;
    /**
     * 自动选择第一行
     */
    autoFocusFirstRow?: boolean;

    style?: CSSProperties
    className?: string
}

export interface ServerApiParams extends Record<string, any> {
    limit: number
    start: number
}
export interface ServerApiResult {
    status: number
    code: number
    result: { list: any[], total: number }
    error?: string
    msg?: string
}
export interface ServerApi {
    (params: ServerApiParams): Promise<ServerApiResult>
}

export interface PaginationState {
    current: number
    total: number
    size: number
}

export interface ServerSideProps {
    pagination: boolean,
    rowModelType: RowModelType
    paginationPageSize: number
    cacheBlockSize: number
    serverSideStoreType: ServerSideStoreType
    serverSideDatasource: { getRows: IServerSideDatasource['getRows'] }
}
