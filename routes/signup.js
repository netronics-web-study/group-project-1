const HIDDEN_CLASSNAME = "hidden";

function is_id_valid() {
    var userInput = document.getElementById("user_id").value;

    fetch("/check_id_validity", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userInput }),
    })
        .then((response) => response.json())
        .then((data) => {
            var resultMessage = document.getElementById("result_message");

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

function registerUser() {
    if (is_id_valid() && is_pw_valid()) {
        on_valid();
    } else {
        if (!is_pw_valid()) {
            on_pw_error();
        }
    }
}

document.getElementById("submit").addEventListener("click", registerUser);
