const HIDDEN_CLASSNAME = "hidden";

const signup = document.getElementById("signup");
const loginButton = document.getElementById("login");
const myPage = document.getElementById("myPage");
const logoutButton = document.getElementById("logout");

const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

// accessToken 을 서버로 보내 인증을 받음
// accessToken 이 유효할 때는 그대로 진행, 유효하지 않으면 refreshToken 으로 인증 시도
fetch("http://localhost:3000/auth/getUserInfo", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      myPage.classList.remove(HIDDEN_CLASSNAME);
      logoutButton.classList.remove(HIDDEN_CLASSNAME);
    } else {
      if (refreshToken) {
        fetch("http://localhost:3000/auth/refresh-token", {
          method: "POST",
          body: JSON.stringify({
            accessToken,
            refreshToken,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              myPage.classList.remove(HIDDEN_CLASSNAME);
              logoutButton.classList.remove(HIDDEN_CLASSNAME);
            }
          })
          .catch((error) => {
            console.error("Error 발생");
          });
      } else {
        signup.classList.remove(HIDDEN_CLASSNAME);
        loginButton.classList.remove(HIDDEN_CLASSNAME);
      }
    }
  })
  .catch((error) => {
    console.error("Error 발생");
  });

// 로그아웃 기능 구현하기
function logout() {
  // 1. 서버에 로그아웃 요청
  fetch("http://localhost:3000/auth/logout", {
    method: "DELETE",
    body: JSON.stringify({ refreshToken: refreshToken }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // 2. 로그아웃 완료 후 처리
        // 로컬 스토리지에 저장된 토큰 삭제

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        alert("로그아웃 되었습니다.");
        // 로그아웃이 완료되면 메인 페이지로 리다이렉트
        window.location.href = "http://localhost:3000";
      } else {
        alert("로그아웃에 실패하였습니다.");
      }
    })
    .catch((error) => {
      console.error("Error 발생");
    });
}

document.getElementById("logout").addEventListener("click", logout);
