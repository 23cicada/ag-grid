
import './App.css'
import { AgGrid } from 'lib/index.ts'
import {useEffect, useState} from "react";
import {Button} from "antd";


interface DataTest {
  name: string
  age: number
  sex: number
  school?: string
  id: string
}
function App() {
  const [count, setCount] = useState({ d: 0 })

  useEffect(() => {

  }, [])

  const api = async (params: any) => {
    async function postData(url = "", data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        // mode: "cors", // no-cors, *cors, same-origin
        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJpYXQiOjE3MDA3OTA2MjQsImV4cCI6MTcwMDc5NDIyNCwianRpIjoiY2U0ODQxNzU3OTcwNDI5N2JjM2U3ZWJjNWEyMDM5YjciLCJ1aWQiOiI0Mzc4OTgxMDEwNTU4MTk3NzYiLCJ0eXBlIjoyfQ.G1eHwSGDPtanLXsxt_QZmRz2nY5naTOrEN7yFbb8K76MJMRs5EGa3HFEEDDxrTCjRtZ4DseUgeOuqb0gW9j1rayJcAN2aubTwPTHufPDawXnV6Qh5z9bRfIN3BJfHowuafAUjaxd82bexjrSfqigI-RMTgh_N0dmSCDfwKJ6bck"
        },
        // redirect: "follow", // manual, *follow, error
        // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }
    return await postData('http://api.ymtx.com/sdk-pos/sdkpos/basic/shopuser/relation/query', {
      customerId: "100000000000000001",
      orgId: '196598702835761191',
      ...params
    })
  }

  return (
    <div>
      <Button onClick={() => setCount({ d: count.d + 1})}>{count.d}</Button>
      <AgGrid<DataTest>
        serverApi={api}
        columnDefs={[{ headerName: 'name', field: 'name' }, { headerName: 'age', field: 'age' }]}
        sizeColumnsToFit
        pagination
        paginationPageSize={10}
        serverHeaderCheckboxSelectionCurrentPageOnly
        autoFocusFirstRow
        domLayout="autoHeight"
        suppressPaginationPanel={false}
      />
    </div>
  )
}

export default App
