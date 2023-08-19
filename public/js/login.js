const user_id = document.getElementById("user_id");
const pw = document.getElementById("pw");
const rememberCheckbox = document.getElementById("remember_id");

function saveToken(accessToken, refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
}
function loadTokens() {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
}

function login() {
    const user_id = document.getElementById("user_id");
    const pw = document.getElementById("pw");

    if (user_id.value !== "" && pw.value !== "") {
        const req = {
            userID: user_id.value,
            password: pw.value,
        };

        fetch("http://localhost:3000/auth/login", {
            method: "POST",
            body: JSON.stringify(req),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("로그인에 성공하였습니다.");
                    //토큰을 받아서 로컬 스토레지에 저장하는 함수
                    saveToken(data.accessToken, data.refreshToken);
                    loadTokens();
                    if (accessToken != null && refreshToken != null) {
                        window.location.href = "http://localhost:3000";
                    }
                } else {
                    alert("로그인에 실패하였습니다. 아이디와 비밀번호를 확인해주세요.");
                }
            })
            .catch((error) => {
                console.error("Error 발생");
            });
    } else {
        alert("아이디와 비밀번호를 입력해주세요.");
    }
}

function remember_id() {
    //아이디 비었을때 로직 추가
    if (user_id.value === "") {
        rememberCheckbox.checked = false;
        alert("아이디를 입력해주세요");
    } else if (rememberCheckbox.checked && user_id.value !== "") {
        localStorage.setItem("remembered_id", user_id.value);
        alert("아이디가 저장되었습니다.");
    } else {
        localStorage.removeItem("remembered_id");
        alert("아이디 저장이 취소되었습니다.");
    }
}

// 아이디 로드
function load_id() {
    const remembered_id = localStorage.getItem("remembered_id");
    if (remembered_id != null) {
        user_id.value = remembered_id;
        rememberCheckbox.checked = true;
    }
}

// 페이지 로드 시 저장된 아이디 불러오기
window.addEventListener("load", load_id);

document.getElementById("remember_id").addEventListener("change", remember_id);
document.getElementById("submit").addEventListener("click", login);
