//
const user_id = document.getElementById("user_id");
const pw = document.getElementById("pw");

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

document.getElementById("submit").addEventListener("click", login);
