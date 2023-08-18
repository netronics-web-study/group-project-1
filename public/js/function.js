function authWithToken(token) {
    fetch("http://localhost:3000/auth/", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                // 로그인된 메인페이지로 이동
                window.location.href = "http://localhost:3000/user";
            } else {
                alert("로그인에 실패하였습니다. 다시 시도해주세요.");
            }
        })
        .catch((error) => {
            console.error("Error 발생");
        });
}
