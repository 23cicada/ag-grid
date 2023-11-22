
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
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJpYXQiOjE3MDA2MzExMzAsImV4cCI6MTcwMDYzNDczMCwianRpIjoiOWU2ZTkwNDgyNjg4NGFmNGE0ZmE3ZDQzN2M5ZTE1YmEiLCJ1aWQiOiI0Mzc4OTgxMDEwNTU4MTk3NzYiLCJ0eXBlIjoyfQ.k0IiTjlSLYjC9kDIAqFIB1oZKyp23_phuXA4qrbkh190G142qbEj5J2vgfhiWbBt8KcmEGFhI0h_v6KCfvcXDtBn0s5OSSbzcnkeE61n3jZOAUeQ2JEfWTbsMmXmmdvIFesb5KwRTnYHfv8oQr0mhxWL_YIaWAsMviTNfAXzk5I"
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
        style={{ height: 400 }}
        serverApi={api}
        columnDefs={[{ headerName: 'name', field: 'name' }, { headerName: 'age', field: 'age' }]}
        sizeColumnsToFit
        pagination
        cacheBlockSize={12}
        paginationPageSize={6}
        serverHeaderCheckboxSelectionCurrentPageOnly
        autoFocusFirstRow
      />
    </div>
  )
}

export default App
