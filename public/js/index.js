const HIDDEN_CLASSNAME = "hidden";

const signup = document.getElementById("signup");
const loginButton = document.getElementById("login");
const myPage = document.getElementById("myPage");
const logoutButton = document.getElementById("logout");

const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

// accessToken 을 서버로 보내 인증을 받음
// accessToken 이 유효할 때는 그대로 진행, 유효하지 않으면 refreshToken 으로 인증 시도
fetch("http://localhost:3000/auth/", {
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
                fetch("http://localhost:3000/auth/", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
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
                signup.classList.add(HIDDEN_CLASSNAME);
                loginButton.classList.add(HIDDEN_CLASSNAME);
                myPage.classList.remove(HIDDEN_CLASSNAME);
                logoutButton.classList.remove(HIDDEN_CLASSNAME);
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
// 서버로부터 유저 정보 가져오기
function requestUserInfo() {
    const timestamp = new Date().getTime();
    fetch("http://localhost:3000/users/mypage", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                //  http://localhost:3000/users/mypage로 이동 후 displayUserInfo(data.userInfo); 호출
                window.location.href = "http://localhost:3000/users/mypage";
            } else {
                // access token이 만료되었으면
                //로컬 스토리지의 리프레시 토큰을 가져와서
                const refreshToken = localStorage.getItem("refreshToken");
                //토큰 갱신 요청
                requestNewToken(refreshToken);
                // 유저 정보 재요청
                requestUserInfo();
            }
        })
        .catch((error) => {
            console.error("Error 발생", error);
        });
}

function requestNewToken() {
    // 새로운 access token 및 refresh token 요청 및 갱신 로직
    fetch("http://localhost:3000/auth/refresh-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: {
            accessToken,
            refreshToken,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                // 새로운 access token과 refresh token을 받아옴
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;

                // 로컬 스토리지에 새로운 access token과 refresh token을 저장
                localStorage.setItem("accessToken", newAccessToken);
                localStorage.setItem("refreshToken", newRefreshToken);
            } else {
                alert("토큰 재발급에 실패했습니다.");
            }
        })
        .catch((error) => {
            console.error("에러가 발생하였습니다.", error);
        });
}

document.getElementById("logout").addEventListener("click", logout);
document.getElementById("myPage").addEventListener("click", requestUserInfo);
