import React, { useMemo, useRef, useImperativeHandle, Ref } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import {ClipboardModule} from '@ag-grid-enterprise/clipboard'
import {MasterDetailModule} from '@ag-grid-enterprise/master-detail'
import {ServerSideRowModelModule} from '@ag-grid-enterprise/server-side-row-model'
import {RangeSelectionModule} from '@ag-grid-enterprise/range-selection'
import { LicenseManager } from '@ag-grid-enterprise/core';
import classnames from 'classnames';
import {
    GridApi, ColumnApi,
    PaginationChangedEvent, FirstDataRenderedEvent,
    CellDoubleClickedEvent, CellKeyDownEvent,
    IServerSideGetRowsParams, NavigateToNextCellParams
} from '@ag-grid-community/core'
import "./index.scss";
import styles from './index.module.scss'

import { ExtraProps, AgGridProps } from './types'
import ServerHeaderComponent from "../components/server-header-component.tsx";
import CustomNoRowsOverlay from "lib/component/components/custom-no-rows-overlay.tsx";
import CustomLoadingOverlay from "lib/component/components/custom-loading-overlay.tsx";
import {GridReadyEvent} from "@ag-grid-community/core/dist/esm/es6/events";
import CustomPagination, { CustomPaginationRef } from '../components/custom-pagination.tsx'

LicenseManager.setLicenseKey("peakandyuri_MTc0NjU5ODM3NjkwMg==ed1b127f739302da69c456a8ea594dfd");


const AgGrid = React.forwardRef(<TData = any,>({
    serverParams,
    sizeColumnsToFit = true,
    autoFocusFirstRow = false,
    rowModelType = 'clientSide',
    serverApi,
    onCellSelected,
    className,
    style,
    antdPaginationProps,
    serverHeaderCheckboxSelectionCurrentPageOnly,
    columnDefs,
    ...props
}: AgGridProps<TData>, ref: Ref<AgGridReact>) => {

    const agGridRef = useRef<AgGridReact>(null)
    const antPaginationRef = useRef<CustomPaginationRef>(null)

    useImperativeHandle(ref, () => agGridRef.current!, [])

    const columnDefsMemo = useMemo(() => {
        if (serverHeaderCheckboxSelectionCurrentPageOnly && columnDefs?.length) {
            const [firstColumn, ...others] = columnDefs
            return [
                {
                    ...firstColumn,
                    headerComponent: ServerHeaderComponent,
                    checkboxSelection: true
                },
                ...others
            ]
        }
        return columnDefs
    }, [columnDefs])

    const serverSideDatasource = useMemo(() => {
        if (!serverApi) return undefined
        return {
            getRows: async (params: IServerSideGetRowsParams) => {
                const { request: { startRow, endRow }, success, api, columnApi } = params
                let rowData: TData[] = [], rowCount = 0;
                try {
                    const { result } = await serverApi({
                        ...serverParams, start: startRow!, limit: endRow! - startRow!
                    })
                    if (Array.isArray(result?.list)) {
                        rowData = result.list
                        rowCount = result.total
                    }
                } catch {}
                success({ rowCount, rowData });
                /** 放在success后 **/
                if (rowData.length && autoFocusFirstRow) {
                    const pageSize = api.paginationGetPageSize()
                    const current = api.paginationGetCurrentPage()
                    setTimeout(() => onFocusFirstRow(pageSize * current, api, columnApi))
                }
            }
        }
    }, [serverParams])

    const extraProps = useMemo(() => {
        let props: ExtraProps = {}
        if (serverApi) {
            props = {
                rowModelType: 'serverSide',
                pagination: true,
                paginationPageSize: 10,
                cacheBlockSize: 50
            }
        }
        if (serverHeaderCheckboxSelectionCurrentPageOnly) {
            props.rowSelection = 'multiple'
            props.rowMultiSelectWithClick = true
        }
        return props
    }, [])

    /**
     * 第一次将数据呈现到网格中时触发
     * 用于设置列的大小调整，以适应水平方向的网格。
     * @param params
     */
    const onFirstDataRendered = (params: FirstDataRenderedEvent) => {
        const { api, columnApi, firstRow } = params
        const model = api.getModel().getType()
        if (model === 'clientSide') {
            /** client-side模型首次渲染选中第一行 **/
            autoFocusFirstRow && onFocusFirstRow(firstRow, api, columnApi)
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
        const model = api.getModel().getType()
        const pageSize = api.paginationGetPageSize()
        const current = api.paginationGetCurrentPage()
        const total = api.paginationGetRowCount()
        antPaginationRef.current?.setPagination({
            current: current + 1,
            total,
            size: pageSize
        })
        if (autoFocusFirstRow && newPage) {
            switch (model) {
                case 'clientSide': onFocusFirstRow(pageSize * current, api, columnApi); break
                case 'serverSide': {
                    /**
                     * server-side 请求未缓存的数据，翻页会执行两次paginationChanged方法，
                     * 排除第一次的请求，此时表格处于loading状态，默认选中第一行事件放在getRows方法中。
                     */
                    const loading = Object.values(api.getCacheBlockState()).some((item: any) => item.pageStatus === 'needsLoading')
                    if (!loading) {
                        onFocusFirstRow(pageSize * current, api, columnApi)
                    }
                } break
            }
        }

        if (props.onPaginationChanged !== undefined) {
            props.onPaginationChanged(params)
        }
    }

    /**
     * 选中第一行，聚焦第一行的第一列
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
        onCellSelected && onCellSelected(event.data)
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
            onCellSelected && onCellSelected(event.data)
        }
        if (props.onCellKeyDown !== undefined) {
            props.onCellKeyDown(event)
        }
    }

    const onGridReady = (event: GridReadyEvent) => {
        if (sizeColumnsToFit) {
            event.api.sizeColumnsToFit()
        }
        props.onGridReady?.(event)
    }

    const navigateToNextCell = (params: NavigateToNextCellParams) => {
        /**
         * 使用键盘方向键选择行
         */
        const suggestedNextCell = params.nextCellPosition;

        const KEY_UP = 'ArrowUp';
        const KEY_DOWN = 'ArrowDown';

        const noUpOrDownKey = params.key !== KEY_DOWN && params.key !== KEY_UP;
        if (noUpOrDownKey) {
            return suggestedNextCell;
        }

        params.api.forEachNode(node => {
            if (node.rowIndex === suggestedNextCell?.rowIndex) {
                node.setSelected(true);
            }
        });

        if (props.navigateToNextCell) {
            return props.navigateToNextCell(params)
        }
        return suggestedNextCell;
    };

    const onCustomPagination: (page: number, pageSize: number) => void = (page) => {
        agGridRef.current?.api.paginationGoToPage(page - 1);
    }
    /**
     * antd Pagination onShowSizeChange事件
     * @param _
     * @param size 需要更改的 每页条数
     */
    const onCustomPageSize: (current: number, size: number) => void = (_, size) => {
        agGridRef.current?.api.paginationSetPageSize(size)
    }

    const modules = useMemo(() => {
        return [
            ClipboardModule,
            MasterDetailModule,
            ServerSideRowModelModule,
            ClientSideRowModelModule,
            RangeSelectionModule
        ]
    }, [])

    const noRowsOverlayComponentParams = useMemo(() => ({
        noRowsMessageFunc: () => '暂无数据'
    }), [])

    const loadingOverlayComponentParams = useMemo(() => ({
        loadingMessage: '加载中...'
    }), [])

    const localeText = useMemo(() => ({
        loadingOoo: '加载中...'
    }), [])

    const defaultColDef = useMemo(() => {
        return {
            resizable: true,
            ...props.defaultColDef
        }
    }, [])

    return (
        <div className={classnames('ag-theme-alpine', styles.container, className)} style={style}>
            <AgGridReact
                containerStyle={{ height: 'initial', flex: 1 }}
                ref={agGridRef}
                rowModelType={rowModelType}
                rowSelection="single"
                modules={modules}
                overlayNoRowsTemplate="无数据"
                overlayLoadingTemplate="加载中"
                /**
                 * 失去焦点后完成编辑
                 */
                suppressPaginationPanel
                stopEditingWhenCellsLoseFocus
                columnDefs={columnDefsMemo}
                serverSideDatasource={serverSideDatasource}

                /**
                 * 以下4个属性只适用 client-side 模型
                 * https://www.ag-grid.com/react-data-grid/overlays/
                 */
                noRowsOverlayComponent={CustomNoRowsOverlay}
                noRowsOverlayComponentParams={noRowsOverlayComponentParams}
                loadingOverlayComponent={CustomLoadingOverlay}
                loadingOverlayComponentParams={loadingOverlayComponentParams}
                /*
                * server-side 模型 加载中提示
                * */
                localeText={localeText}

                {...extraProps}
                {...props}
                onGridReady={onGridReady}
                navigateToNextCell={navigateToNextCell}
                onPaginationChanged={onPaginationChanged}
                onFirstDataRendered={onFirstDataRendered}
                onCellDoubleClicked={onCellDoubleClicked}
                onCellKeyDown={onCellKeyDown}
                defaultColDef={defaultColDef}
            />
            {props.pagination && (
                <CustomPagination
                    ref={antPaginationRef}
                    onChange={onCustomPagination}
                    onShowSizeChange={onCustomPageSize}
                    {...antdPaginationProps}
                />
            )}
        </div>
    )
})
export { AgGrid }
export * from './types';
export * from '@ag-grid-community/core'
export * from '@ag-grid-community/react'
