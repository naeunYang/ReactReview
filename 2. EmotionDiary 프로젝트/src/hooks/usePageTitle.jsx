import { useEffect } from "react";

// 페이지 제목 설정
const usePageTitle = (title) => {
  useEffect(() => {
    const $title = document.getElementsByTagName("title")[0]; // 관례상 Dom을 저장하는 변수명에 $을 붙임
    $title.innerText = title;
  }, [title]);
};

export default usePageTitle;
