function logout(token) {
    // 1. 로컬 스토리지에 저장된 토큰 삭제
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // 2. 서버에 로그아웃 요청
    fetch("http://localhost:3000/auth/logout", {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.text())
        .then((data) => {
            if (data.success) {
                // 3. 로그아웃 완료 후 처리
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

document.getElementById("logoutButton").addEventListener("click", logout);
