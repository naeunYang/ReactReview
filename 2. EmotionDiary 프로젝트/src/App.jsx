import "./App.css";
import { useReducer, useRef, createContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import New from "./pages/New";
import Notfound from "./pages/Notfound";
import Edit from "./pages/Edit";

// const mockData = [
//   {
//     id: 1,
//     createdDate: new Date("2025-06-10").getTime(),
//     emotionId: 1,
//     content: "1번 일기 내용",
//   },
//   {
//     id: 2,
//     createdDate: new Date("2025-06-09").getTime(),
//     emotionId: 2,
//     content: "2번 일기 내용",
//   },
//   {
//     id: 3,
//     createdDate: new Date("2025-05-05").getTime(),
//     emotionId: 3,
//     content: "3번 일기 내용",
//   },
// ];

// function reducer(state, action) {
//   switch (action.type) {
//     case "CREATE":
//       return [action.data, ...state];
//     case "UPDATE":
//       return state.map((item) =>
//         String(item.id) === String(action.data.id) ? action.data : item
//       );
//     case "DELETE":
//       return state.filter((item) => String(item.id) !== String(action.id));
//     default:
//       return state;
//   }
// }

function reducer(state, action) {
  let nextState; // localStorage에 데이터 보관을 위함

  switch (action.type) {
    case "INIT":
      return action.data; // 여기서는 nextState에 넣을 필요가 없음
    case "CREATE": {
      nextState = [action.data, ...state];
      break;
    }
    case "UPDATE": {
      nextState = state.map((item) =>
        String(item.id) === String(action.data.id) ? action.data : item
      );
      break;
    }
    case "DELETE": {
      nextState = state.filter((item) => String(item.id) !== String(action.id));
      break;
    }
    default:
      return state;
  }

  localStorage.setItem("diary", JSON.stringify(nextState));
  return nextState;
}

export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();

function App() {
  const [isLoading, setIsLoading] = useState(true); // 로딩이 끝나기 전까지 페이지 컴포넌트들은 렌더링되지 않는다.
  const [data, dispatch] = useReducer(reducer, []);
  const idRef = useRef(0);

  useEffect(() => {
    const storedData = localStorage.getItem("diary");
    if (!storedData) {
      setIsLoading(false);
      return;
    }

    // JSON.parse(): JSON 문자열 -> 객체
    const parsedData = JSON.parse(storedData);
    // 혹시라도 paesedData가 객체가 아닌 경우에 forEach를 사용하면 오류가 발생하기 때문에 예외 처리
    if (!Array.isArray(parsedData)) {
      setIsLoading(false);
      return;
    }

    let maxId = 0;
    parsedData.forEach((item) => {
      if (Number(item.id) > maxId) {
        // 기본적으로 문자열로 저장되기 때문에 Number로 형변환 필요함
        maxId = Number(item.id);
      }
    });

    idRef.current = maxId + 1;

    dispatch({
      type: "INIT",
      data: parsedData,
    });

    setIsLoading(false);
  }, []);

  // 웹 스토리지 사용법!
  // 데이터 저장
  // localStorage.setItem("test", "hello"); // (key, value) key값은 원시타입의 값만 넣을 수 있음
  // localStorage.setItem("person", JSON.stringify({ name: "이정환" }));
  // -> value가 object Object로 저장되는 이유는 웹 스토리지는 기본적으로 모든 값을 문자열로 저장하기 때문
  // -> 따라서 객체를 문자열로 변환해서 넣어줘야 한다.

  // 데이터 불러오기
  // console.log(localStorage.getItem("test")); // hello
  // console.log(localStorage.getItem("person")); // {"name":"이정환"} -> 객체 모양의 문자열로 출력
  // console.log(JSON.parse(localStorage.getItem("person"))); //  {name: '이정환'} -> 객체로 출력
  // 주의! JSON.parse()에 undefined나 null이 전달되면 바로 오류가 발생한다.

  // 데이터 삭제
  // localStorage.removeItem("test"); // 그냥 개발자 도구 Application에서 del 키로 지울 수도 있다.

  // 새로운 일기 추가
  const onCreate = (createdDate, emotionId, content) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  // 기존 일기 수정
  const onUpdate = (id, createdDate, emotionId, content) => {
    dispatch({
      type: "UPDATE",
      data: {
        id,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  // 기존 일기 삭제
  const onDelete = (id) => {
    dispatch({
      type: "DELETE",
      id,
    });
  };

  if (isLoading) {
    return <div>데이터 로딩중입니다...</div>;
  }

  return (
    <>
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={{ onCreate, onUpdate, onDelete }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<New />} />
            <Route path="/diary/:id" element={<Diary />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </>
  );
}

export default App;
