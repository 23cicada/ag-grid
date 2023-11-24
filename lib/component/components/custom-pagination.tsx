import styles from "lib/component/ag-grid/index.module.scss";
import {Pagination} from "antd";
import {useImperativeHandle, useState} from "react";
import {PaginationState} from "lib/component/ag-grid";
import { AgGridProps } from '../ag-grid/types.ts'
import { forwardRef } from 'react'

export interface CustomPaginationRef {
    setPagination: (params: PaginationState) => void
}
const CustomPagination = forwardRef<CustomPaginationRef, AgGridProps['antdPaginationProps']>((props, ref) => {
    /**
     * current：当前页
     * total：总条数
     * size: 每页条数
     */
    const [pagination, setPagination] = useState<PaginationState>({
        current: 0, total: 0, size: 0
    })

    useImperativeHandle(ref, () => ({
        setPagination: ({ current, total, size }) => {
            setPagination({ current, total, size })
        }
    }), [])
    return (
        <Pagination
            simple
            className={styles.pagination}
            showTotal={(total, range) => `第${range[0]} - ${range[1]}条，共 ${total} 条`}
            total={pagination.total}
            pageSize={pagination.size}
            current={pagination.current}
            showSizeChanger={false}
            {...props}
        />
    )
})
export default CustomPagination