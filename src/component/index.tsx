import React, { useCallback, useMemo, useState, useRef, useImperativeHandle } from 'react';
import { message, Pagination } from 'antd'
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import {ClipboardModule} from '@ag-grid-enterprise/clipboard'
import {MasterDetailModule} from '@ag-grid-enterprise/master-detail'
import {ServerSideRowModelModule} from '@ag-grid-enterprise/server-side-row-model'
import {RangeSelectionModule} from '@ag-grid-enterprise/range-selection'
import { LicenseManager } from '@ag-grid-enterprise/core';
import {
    AgGridProps, PaginationState,
   GridApi, ColumnApi,
    PaginationChangedEvent, FirstDataRenderedEvent,
    CellDoubleClickedEvent, CellKeyDownEvent,
    IServerSideGetRowsParams, ServerSideProps
} from '@/types';
import "./index.scss";
import classnames from 'classname';

LicenseManager.setLicenseKey("peakandyuri_MTc0NjU5ODM3NjkwMg==ed1b127f739302da69c456a8ea594dfd");

const AgGrid = React.forwardRef<AgGridReact, AgGridProps>(({
    serverParams,
    sizeColumnsToFit = true,
    autoFocusFirstRow = false,
    rowModelType = 'clientSide',
    serverApi,
    onCellSeleted,
    className,
    style,
    ...props
}, ref) => {

    const agGridRef = useRef<AgGridReact>(null)
    /**
     * current：当前页
     * total：总条数
     * size: 每页条数
     */
    const [pagination, setPagination] = useState<PaginationState>({
        current: 0, total: 0, size: 0
    })

    useImperativeHandle(ref, () => agGridRef.current!, [])

    const serverSideProps: ServerSideProps|undefined = useMemo(() => {
        if (serverApi) {
            return {
                rowModelType: 'serverSide',
                pagination: true,
                paginationPageSize: 10,
                cacheBlockSize: 50,
                serverSideStoreType: 'partial',
                serverSideDatasource: { getRows }
            }
        }
    }, [])


    const getRows = useCallback(async (params: IServerSideGetRowsParams) => {
        if (serverApi) {
            const { request: { startRow, endRow }, success, api, columnApi } = params
            let rowData = [], rowCount = 0;
            try {
                const { status, code, error, msg, result } = await serverApi({
                    ...serverParams, start: startRow!, limit: endRow! - startRow!
                })
                if (status === 200 && !code) {
                    rowData = result.list
                    rowCount = result.total
                } else if (error || msg) {
                    message.error(error || msg);
                }
            } catch {
                message.error("查询失败！");
            }
            if (rowData.length) {
                if (autoFocusFirstRow) {
                    const pageSize = api.paginationGetPageSize()
                    const current = api.paginationGetCurrentPage()
                    onFocusFirstRow(pageSize * current, api, columnApi)
                }
                if (sizeColumnsToFit) {
                    api.sizeColumnsToFit()
                }
            }
            success({ rowCount, rowData });
        }
    }, [serverParams])

    /**
     * antd Pagination onChange事件
     * @param page 需要跳转的 页码
     */
    const onCustomPagination: (page: number, pageSize: number) => void = (page) => {
        agGridRef.current?.api?.paginationGoToPage(page - 1);
    }
    /**
     * antd Pagination onShowSizeChange事件
     * @param size 需要更改的 每页条数
     */
    const onCustomPageSize: (current: number, size: number) => void = (_, size) => {
        agGridRef.current?.api?.paginationSetPageSize(size)
    }

    /**
     * 第一次将数据呈现到网格中时触发
     * 用于设置列的大小调整，以适应水平方向的网格。
     * @param params
     */
    const onFirstDataRendered = (params: FirstDataRenderedEvent) => {
        const { api, columnApi, firstRow } = params
        if (rowModelType === 'clientSide') {
            autoFocusFirstRow && onFocusFirstRow(firstRow, api, columnApi)
            sizeColumnsToFit && api.sizeColumnsToFit()
        }
        if (props.onFirstDataRendered !== undefined) {
            props.onFirstDataRendered(params)
        }
    }

    /**
     * ag grid 分页状态改变时触发
     * 用于设置分页参数，以供antd Pagination 使用
     * @param params
     */
    const onPaginationChanged = (params: PaginationChangedEvent) => {
        const { api, columnApi, newPage } = params
        setPagination({
            current: api.paginationGetCurrentPage() + 1,
            total: api.paginationGetRowCount(),
            size: api.paginationGetPageSize()
        })
        if (props.onPaginationChanged !== undefined) {
            props.onPaginationChanged(params)
        }
        // 选中第一行
        if (autoFocusFirstRow && newPage) {
            const pageSize = api.paginationGetPageSize()
            const current = api.paginationGetCurrentPage()
            onFocusFirstRow(pageSize * current, api, columnApi)
        }
    }

    /**
     * 选中第一行
     */
    const onFocusFirstRow = (index: number, api: GridApi, columnApi: ColumnApi) => {
        const firstDisplayedNode = api.getDisplayedRowAtIndex(index)
        if (firstDisplayedNode) {
            firstDisplayedNode.setSelected(true)
            api.setFocusedCell(firstDisplayedNode.rowIndex as number, columnApi.getAllDisplayedColumns()[0])
        }
    }

    /**
     * 单元格双击事件
     * @param event
     */
    const onCellDoubleClicked = (event: CellDoubleClickedEvent) => {
        onCellSeleted && onCellSeleted(event.data)
        if (props.onCellDoubleClicked !== undefined) {
            props.onCellDoubleClicked(event)
        }
    }

    /**
     * 单元格键盘事件
     * @param event
     */
    const onCellKeyDown = (event: CellKeyDownEvent) => {
        // @ts-ignore
        if (event.event.key === 'Enter') {
            onCellSeleted && onCellSeleted(event.data)
        }
        if (props.onCellKeyDown !== undefined) {
            props.onCellKeyDown(event)
        }
    }

    return (
        <div className={classnames(className, 'ag-theme-alpine')} style={style}>
            <AgGridReact
                ref={agGridRef}
                rowModelType={rowModelType}
                rowSelection="single"
                modules={[
                    ClipboardModule,
                    MasterDetailModule,
                    ServerSideRowModelModule,
                    ClientSideRowModelModule,
                    RangeSelectionModule
                ]}
                overlayNoRowsTemplate="无数据"
                overlayLoadingTemplate="加载中"
                /**
                 * 失去焦点后完成编辑
                 */
                stopEditingWhenCellsLoseFocus
                suppressPaginationPanel
                /**
                 * 服务端模型需要新增的表格props
                 */
                {...serverSideProps} 
                {...props}
                onPaginationChanged={onPaginationChanged}
                onFirstDataRendered={onFirstDataRendered}
                onCellDoubleClicked={onCellDoubleClicked}
                onCellKeyDown={onCellKeyDown}
                paginationNumberFormatter={e => {
                    return 'xxxhhh'
                }}
                defaultColDef={{
                    resizable: true,
                    ...props.defaultColDef
                }}
            />
            <Pagination
                showQuickJumper
                onChange={onCustomPagination}
                onShowSizeChange={onCustomPageSize}
                showTotal={(total, range) => <span>第{range[0]} - {range[1]}条，共 {total} 条</span>}
                total={pagination.total}
                pageSize={pagination.size}
                current={pagination.current}
            />
        </div>
    )
})

export default AgGrid
