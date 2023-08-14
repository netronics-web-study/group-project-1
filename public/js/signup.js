const HIDDEN_CLASSNAME = "hidden";

const user_id = document.getElementById("user_id");
const user_name = document.getElementById("name");
const pw1 = document.getElementById("pw1");
const pw2 = document.getElementById("pw2");

function is_pw_valid() {
    if (pw1.value === pw2.value) {
        return true;
    } else {
        return false;
    }
}

function on_pw_error() {
    alert("패스워드를 다시 입력해주세요.");
    pw1.value = "";
    pw2.value = "";
}

function is_id_valid() {
    const userInput = document.getElementById("user_id").value;
    fetch("/check_id_validity", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userInput }),
    })
        .then((response) => response.json())
        .then((data) => {
            const resultMessage = document.getElementById("result_message");
            if (data.success) {
                resultMessage.classList.remove(HIDDEN_CLASSNAME);
                resultMessage.textContent = "사용 가능한 아이디입니다";
                resultMessage.style.color = "green";
                return true;
            } else {
                resultMessage.classList.remove(HIDDEN_CLASSNAME);
                resultMessage.textContent = "사용 불가능한 아이디입니다. 다른 아이디를 입력해주세요";
                resultMessage.style.color = "red";
                return false;
            }
        })
        .catch((error) => {
            resultMessage.classList.remove(HIDDEN_CLASSNAME);
            resultMessage.textContent = "오류가 발생했습니다. 다시 시도해주세요";
            resultMessage.style.color = "red";
            console.error("Error:", error);
            return false;
        });
}

function is_valid() {
    if (!is_id_valid()) {
        alert("아이디 중복 체크를 먼저 해주세요.");
    }

    if (user_id.value !== "" && user_name.value !== "" && pw1.value !== "" && pw2.value !== "") {
        return true;
    } else {
        alert("모든 정보를 입력해주세요");
        return false;
    }
}

function deleteInput() {
    user_id.value = "";
    user_name.value = "";
    pw1.value = "";
    pw2.value = "";
}

// 서버로 데이터를 전송하는 함수
function on_valid(user_id, user_name, password) {
    if (is_valid()) {
        const req = {
            user_id: user_id.value,
            user_name: user_name.value,
            password: password.value,
        };

        fetch("서버URL", {
            method: "POST",
            body: JSON.stringify(req),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("회원가입에 성공하였습니다.");
                    deleteInput();
                } else {
                    alert("회원가입에 실패하였습니다.");
                }
            })
            .catch((error) => {
                console.error("Error 발생");
            });
    }
}

function registerUser() {
    if (is_id_valid() && is_pw_valid()) {
        on_valid(user_id, user_name, pw1);
    } else {
        if (!is_pw_valid()) {
            on_pw_error();
        }
    }
}

document.getElementById("submit").addEventListener("click", registerUser);
