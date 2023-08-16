const user_id = document.getElementById("user_id");
const pw = document.getElementById("pw");
const rememberCheckbox = document.getElementById("remember_id");

function login() {
    if (user_id.value !== "" && pw.value !== "") {
        const req = {
            user_id: user_id.value,
            password: pw.value,
        };

        fetch("URL", {
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
                    // 로그인 이후 동작 미구현
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
    if (rememberCheckbox.checked && user_id.value !== "") {
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
