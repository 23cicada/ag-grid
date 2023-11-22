import {Spin} from "antd";

const CustomLoadingOverlay = (props: any) => {
    console.log(props)
    return (
        <>
            <Spin />
            <div style={{color: '#1890ff', marginTop: 6}}>{props.loadingMessage}</div>
        </>
    )
}

export default CustomLoadingOverlay