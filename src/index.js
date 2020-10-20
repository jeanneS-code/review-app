//import { AppContainer } from "react-hot-loader/root"
import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import "bootswatch/dist/yeti/bootstrap.min.css"

ReactDOM.render(
  <React.StrictMode>
    {/* //<AppContainer> */}
    <App />
    {/* //</AppContainer> */}
  </React.StrictMode>,
  document.getElementById("root")
)
// if (module.hot) {
//   module.hot.accept("./App", () => {
//     const NextApp = require("./App").default
//     ReactDOM.render(
//       <AppContainer>
//         <NextApp />
//       </AppContainer>,
//       document.getElementById("root")
//     )
//   })
//}
