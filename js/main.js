let users = [
    {
        name: "admin",
        email: "admin@gmail.com",
        password : "123456",
        role: "ADMIN"
    }
];

if (localStorage.getItem("users")) {
    users = JSON.parse(localStorage.getItem("users"))
} else {
    localStorage.setItem("users", JSON.stringify(users))
}