import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import Editor from "../components/Editor";
import { useContext, useEffect, useState } from "react";
import { DiaryDispatchContext, DiaryStateContext } from "../App";
import useDiary from "../hooks/useDiary";
import usePageTitle from "../hooks/usePageTitle";

const Edit = () => {
  const params = useParams();
  const nav = useNavigate();
  const { onDelete, onUpdate } = useContext(DiaryDispatchContext);
  usePageTitle(`${params.id}번 일기 수정`);

  const curDiaryItem = useDiary(params.id);
  // Diary 페이지에서도 똑같은 기능이 필요하기 때문에 따로 커스텀 훅으로 분리해줄 필요가 있다.
  // const data = useContext(DiaryStateContext);
  // const [curDiaryItem, setCurDiaryItem] = useState();

  // useEffect(() => {
  //   const currentDiaryItem = data.find(
  //     (item) => String(item.id) === String(params.id)
  //   );

  //   if (!currentDiaryItem) {
  //     window.alert("존재하지 않는 일기입니다.");
  //     nav("/", { replace: true }); // nav는 컴포넌트들이 전부 마운트 된 후에 사용할 수 있다.
  //   }

  //   setCurDiaryItem(currentDiaryItem);
  // }, [params.id]);
  // 의존성 배열에 data 제거
  // -> React Router v7 업데이트로 인한 동작 방식 변경 대문
  // -> 기존의 nav함수는 동기적으로 동작했기 때문에 nav()가 호출되는 즉시 페이지를 이동시켰기 때문에 함수 호출 이후 어떠한 useEffect나 훅이 동작하지 않았음
  // -> 하지만, v7버전부터는 비동기적으로 동작하게 되면서 nav()함수 호출 이후에도 기존 페이지의 useEffect 등 코드들이 실행됨
  // -> nav("/", { replace: true }); 가 호출된 이후에 data의 상태가 변화하면서 useEffect가 다시 한번 실행됨 -> 이 시점에는 존재하지 않는 item이 된다.
  // 그렇기 때문에 삭제하기 클릭 시 "존재하지 않는 일기입니다."라는 팝업창이 뜨게 됨 -> useEffect의 data 제거

  const onClickDelete = () => {
    // 브라우저 내장 기능(팝업창)
    if (window.confirm("일기를 정말 삭제할까요? 다시 복구되지 않아요!")) {
      // 일기 삭제 로직
      onDelete(params.id);
      nav("/", { replace: true }); // 이건 동작되는 이유는 이벤트 핸들러이기 때문에 실제로 컴포넌트가 렌더링 되고 삭제 버튼을 클릭했을 때 동작하게 됨
    }
  };

  // const getCurrentDiaryItem = () => {
  //   const currentDiaryItem = data.find(
  //     (item) => String(item.id) === String(params.id)
  //   );

  //   if (!currentDiaryItem) {
  //     window.alert("존재하지 않는 일기입니다.");
  //     nav("/", { replace: true }); // nav는 컴포넌트들이 전부 마운트 된 후에 사용할 수 있다. -> useEffect로 이동
  //   }

  //   return currentDiaryItem;
  // };

  // const currentDiaryItem = getCurrentDiaryItem();
  // console.log(currentDiaryItem);
  // You should call navigate() in a React.useEffect(), not when your component is first rendered. 오류
  // -> navigate()를 컴포넌트가 완전히 렌더링되기 전에 호출해서 발생하는 문제

  const onSubmit = (input) => {
    if (window.confirm("일기를 정말 수정할까요?")) {
      onUpdate(
        params.id,
        input.createdDate.getTime(),
        input.emotionId,
        input.content
      );
    }
    nav("/", { replace: true });
  };

  return (
    <div>
      <Header
        title={"일기 수정하기"}
        leftChild={
          <Button
            onClick={() => {
              nav(-1);
            }}
            text={"< 뒤로 가기"}
          />
        }
        rightChild={
          <Button onClick={onClickDelete} text={"삭제하기"} type={"NEGATIVE"} />
        }
      />
      <Editor initData={curDiaryItem} onSubmit={onSubmit} />
    </div>
  );
};

export default Edit;
