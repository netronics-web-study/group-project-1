const { func } = require("joi");

const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
//서버에서 받아온 정보를 화면에 표시
function displayUserInfo(userInfo) {
    const userIdElement = document.getElementById("user_id");
    const nameElement = document.getElementById("name");
    const pw1Element = document.getElementById("pw1");
    const pw2Element = document.getElementById("pw2");
    userIdElement.textContent = userInfo.userID;
    nameElement.placeholder = userInfo.name;
    pw1Element.placeholder = userInfo.password;
    pw2Element.placeholder = "새로운 비밀번호를 입력해주세요";
}

//회원정보 수정 요청
function updateUserInfo() {
    const newName = document.getElementById("name").value;
    const newPw1 = document.getElementById("pw1").value;
    const newPw2 = document.getElementById("pw2").value;

    if (newPw1 !== newPw2) {
        alert("새로운 비밀번호가 일치하지 않습니다.");
        return;
    }

    const updatedInfo = {
        name: newName,
        password: newPw1,
    };

    fetch("http://localhost:3000/users/mypage/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedInfo),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("회원정보가 수정되었습니다.");
            } else {
                alert("회원정보 수정에 실패하였습니다.");
            }
        })
        .catch((error) => {
            console.error("Error 발생");
        });
}
function requestNewToken(refreshToken) {
    // 새로운 access token 및 refresh token 요청 및 갱신 로직
    fetch("http://localhost:3000/auth/refresh-token", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
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
// 서버로부터 유저 정보 가져오기
function requestUserInfo() {
    fetch("http://localhost:3000/users/mypage", {
        method: "GET",
        headers: {
            accessToken: accessToken,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            // access token이 만료되었으면
            if (!data.success) {
                //로컬 스토리지의 리프레시 토큰을 가져와서
                const refreshToken = localStorage.getItem("refreshToken");
                //토큰 갱신 요청
                requestNewToken(refreshToken);
                // 유저 정보 재요청
                const newAccessToken = localStorage.getItem("accessToken");
                const newRefreshToken = localStorage.getItem("refreshToken");
                requestUserInfo(newAccessToken);
            } else if (data.success) {
                displayUserInfo(data.userInfo);
            } else {
                alert("유저 정보를 가져오는 데 실패하였습니다.");
            }
        })
        .catch((error) => {
            console.error("Error 발생", error);
        });
}

// 버튼 클릭 이벤트 처리
document.getElementById("update_button").addEventListener("click", updateUserInfo);
document.getElementById("main_page_button").addEventListener("click", () => {
    window.location.href = "http://localhost:3000";
});

// 페이지 로딩 시 유저 정보 가져오기
requestUserInfo();
