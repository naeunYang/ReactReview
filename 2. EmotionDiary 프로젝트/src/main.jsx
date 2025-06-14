import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
// BrowserRouter: 브라우저의 현재 주소를 저장하고 감지하는 역할
// 모든 컴포넌트들이 페이지 라우팅과 관련된 모든 데이터들을 공급받아서 사용할 수 있다.
